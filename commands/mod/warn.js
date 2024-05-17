const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const warningSchema = require('../../schemas/warnSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('warn system')
        .addSubcommand(subcommand => subcommand.setName('add').setDescription('Adding Warn To A Speciefic User').addUserOption(option => option.setName('target').setDescription('Target User').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('Your Reason To Warning Someone').setRequired(false)))
        .addSubcommand(subcommand => subcommand.setName('list').setDescription('Your Warn(s) List').addUserOption(option => option.setName('target').setDescription('Target User Warn List').setRequired(false)))
        .addSubcommand(subcommand => subcommand.setName('delete').setDescription('To Delete Some Warns').addUserOption(option => option.setName('target').setDescription('Target User To Delete Warns').setRequired(true))),
    async execute(interaction){
        const { options, guildId, user} = interaction;
        if(options.getSubcommand() == "add") {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({content: "You Have Not Permission To Warn Someone!\nPermission: **Kick Members**", ephemeral: true});
            const target = options.getUser('target');
            const reason = options.getString('reason') || "No Reason Wrote";
        
            warningSchema.findOne({ GuildID: guildId, UserID: target.id, Username: target.username }, async (err, data) => {
              if(err) throw err;
              if(!data) {
                data = new warningSchema({
                  GuildID: guildId,
                  UserID: target.id,
                  Username: target.username,
                  Content: [
                    {
                      ExecuterID: user.id,
                      ExecuterUser: user.username,
                      Reason: reason
                    }
                  ],
                });
              } else {
                const warnContent = {
                  ExecuterID: user.id,
                  ExecuterUser: user.username,
                  Reason: reason
                }
                data.Content.push(warnContent);
              }
              data.save();
            });
        
            const embedu = new EmbedBuilder()
                 .setTitle('Warning System')
                 .setColor('Red')
                 .setDescription(`:red_circle: You Have Been Warned In ${interaction.guild.name}\nReason: ${reason}`);
            
            const embeds1 = new EmbedBuilder()
                  .setTitle('Warning System')
                  .setColor('Red')
                  .setDescription(`:white_check_mark: ${target.tag} Has Been Warned\nReason: ${reason}`);
        
            target.send({embed: [embedu]}).catch(err => {
              return;
            });
        
            interaction.reply({embeds: [embeds1]});
        } else if(options.getSubcommand() == "list") {
            const target = options.getUser('target') || user;
            const embed1 = new EmbedBuilder().setTitle('Warn System');
            const noWarn = new EmbedBuilder().setTitle('Warn System');
        
            warningSchema.findOne({ GuildID: guildId, UserID: target.id, Username: target.username }, async (err, data) => {
              if(err) throw err;
              if(data) {
                embed1.setColor('Red').setDescription(`:octagonal_sign: ${target.username}'s Warns: ${data.Content.map(
                  (w, i) => 
                    `
                         Number: ${i + 1}
                         Warner: ${w.ExecuterUser}
                         Reason: ${w.Reason}
                    `
                ).join('----------------')}`);
                interaction.reply({embeds: [embed1]});
              } else {
                noWarn.setColor('Green').setDescription(`:white_check_mark: ${target.username} Has No Warn!`)
                interaction.reply({embeds: [noWarn]});
              }
            });
        } else if(options.getSubcommand() == "delete") {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({content: "You Don't Have Perssion To Delete Warn(s)\nPermission: **Kick Members**", ephemeral: true});
            const target = options.getUser('target');

            const embed2 = new EmbedBuilder().setTitle('Warn System')
        
            warningSchema.findOne({ GuildID: guildId, UserID: target.id, Username: target.username }, async (err, data) => {
              if(err) throw err;
              if(data) {
                await warningSchema.findOneAndDelete({ GuildID: guildId, UserID: target.id, Username: target.username });
                embed2.setColor('Green').setDescription(`:white_check_mark: ${target.tag}'s Have Been Deleted!`);
                interaction.reply({embeds: [embed2]});
              }else{
                interaction.reply({content: `${target.username} Has No Warn To Delete`, ephemeral: true});
              }
            });
        } else {
            interaction.reply('Some Errors Have Been Accured!')
        }


 }        
}