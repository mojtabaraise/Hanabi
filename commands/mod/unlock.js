const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { logchannel1, logchannel2, logchannel3, serverid1, serverid2, serverid3 } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks A Text Channel To Default Users Can Send Message')
        .addChannelOption(option => option.setName('target-channel').setDescription('target channel to be unlocked').setRequired(false).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)),

        async execute(interaction) {
            const { options, user, client} = interaction;
            const channel = options.getChannel('target-channel') || interaction.channel;
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({content: `You Don't Have Permission Unlock Channel!`, ephemeral: true});
            const channellogse1 = await interaction.client.channels.cache.get(logchannel1);
            const channellogse2 = await interaction.client.channels.cache.get(logchannel2);
            const channellogse3 = await interaction.client.channels.cache.get(logchannel3);
            const logembed = new EmbedBuilder()
                  .setTitle("Unlock Channel Log")
                  .setColor("Blurple")
                  .setDescription("A Channel Has Been Unlocked!")
                  .addFields({name: 'Channel:', value: `${channel.name} | ${channel.id} | ${channel}`})
                  .addFields({name: 'Mod:', value: `${user.username} | ${user.id}`})
                  .setTimestamp();
            const chembed = new EmbedBuilder()
                  .setTitle("Unlocked")
                  .setColor("Green")
                  .setDescription(`:white_check_mark: ${channel} Has Been Unlocked Successfully`)
                  .setFooter({ text: `Command By ${user.username}`, iconURL: user.displayAvatarURL()})
                  .setTimestamp();

            channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true });

            let sv = interaction.guild.id;
            if(sv == serverid1) {
                await channellogse1.send({embeds: [logunbanem]});
            }else if(sv == serverid2) {
                await channellogse2.send({embeds: [logunbanem]});
            }else if(sv == serverid3) {
                await channellogse3.send({embeds: [logunbanem]});
            }

            interaction.reply({embeds: [chembed]});
        }
}