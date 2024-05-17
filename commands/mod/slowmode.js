const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { logchannel1, logchannel2, logchannel3, serverid1, serverid2, serverid3 } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Sets Slowmode For A Channel")
        .addIntegerOption(option => option.setName("duration").setDescription('The Duration You Want To Set Slowmode').setRequired(true))
        .addChannelOption(option => option.setName('target-channel').setDescription('The Channel You Want To Set Slowmode').addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(false)),

        async execute(interaction) {
            const { options } = interaction;

            const channel = options.getChannel('tareget-channel') || interaction.channel;
            const duration = options.getInteger('duration');

            const embed = new EmbedBuilder()
                  .setTitle('Save Slowmode')
                  .setDescription(`${channel} Has Now ${duration} Seconds Slowmode`)
                  .setColor("Green")
                  .setFooter({ text: `Requested By ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
                  .setTimestamp();

            const logem = new EmbedBuilder()
                  .setTitle("Slowmode Log")
                  .setDescription("Someone Sets Slowmode For A Channel")
                  .setColor('Blurple')
                  .addFields({name: `Channel:`, value: `${channel} | ${channel.name} | ${channel.id}`})
                  .addFields({name: `Mod:`, value: `${interaction.user.username} | ${interaction.user.id}`})
                  .addFields({name: `Slowmode:`, value: `${duration} Seconds`})
                  .setTimestamp();
            
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({content: `You Don't Have Permission To Set Slowmode`, ephemeral: true});

            channel.setRateLimitPerUser(duration).catch(err => {
                return;
            })

            const channellogse1 = await interaction.client.channels.cache.get(logchannel1);
            const channellogse2 = await interaction.client.channels.cache.get(logchannel2);
            const channellogse3 = await interaction.client.channels.cache.get(logchannel3);
            await interaction.reply({embeds: [embed]});
            let sv = interaction.guild.id;
            if(sv == serverid1) {
                await channellogse1.send({embeds: [logem]});
            }else if(sv == serverid2) {
                await channellogse2.send({embeds: [logem]});
            }else if(sv == serverid3) {
                await channellogse3.send({embeds: [logem]});
            }
        }
}