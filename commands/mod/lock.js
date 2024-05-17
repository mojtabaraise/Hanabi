const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { logchannel1, logchannel2, logchannel3, serverid1, serverid2, serverid3 } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks A Text Channel To Default Users Can\'t Send Message')
        .addChannelOption(option => option.setName('target-channel').setDescription('target channel to be locked').setRequired(false).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)),

        async execute(interaction) {
            const { options, user, client} = interaction;
            const channel = options.getChannel('target-channel') || interaction.channel;
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({content: `You Don't Have Permission Lock Channel!`, ephemeral: true});
            const channellogse1 = await interaction.client.channels.cache.get(logchannel1);
            const channellogse2 = await interaction.client.channels.cache.get(logchannel2);
            const channellogse3 = await interaction.client.channels.cache.get(logchannel3);
            const logembed = new EmbedBuilder()
                  .setTitle("Lock Channel Log")
                  .setColor("Blurple")
                  .setDescription("A Channel Has Been Locked!")
                  .addFields({name: 'Channel:', value: `${channel.name} | ${channel.id} | ${channel}`})
                  .addFields({name: 'Mod:', value: `${user.username} | ${user.id}`})
                  .setTimestamp();
            const chembed = new EmbedBuilder()
                  .setTitle("Locked")
                  .setColor("Green")
                  .setDescription(`:white_check_mark: ${channel} Has Been Locked Successfully`)
                  .setFooter({ text: `Command By ${user.username}`, iconURL: user.displayAvatarURL()})
                  .setTimestamp();

            channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false });

            let sv = interaction.guild.id;
            if(sv == serverid1) {
                await channellogse1.send({embeds: [logembed]});
            }else if(sv == serverid2) {
                await channellogse2.send({embeds: [logembed]});
            }else if(sv == serverid3) {
                await channellogse3.send({embeds: [logembed]});
            }

            interaction.reply({embeds: [chembed]});
        }
}