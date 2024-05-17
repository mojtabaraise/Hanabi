const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription('Shows The Latency of bot'),

        async execute(interaction) {
            await interaction.deferReply();
            const reply = await interaction.fetchReply();
            const ping = reply.createdTimestamp - interaction.createdTimestamp;
            const embed = new EmbedBuilder()
                 .setTitle("Ping")
                 .setColor("Green")
                 .setDescription(`:ping_pong: Pong!`)
                 .addFields({name: `Message Latency:`, value: `${ping}ms`})
                 .addFields({name: `WS Latency:`, value: `${interaction.client.ws.ping}ms`})
                 .setFooter({ text: `Requested By ${interaction.user.globalName}`, iconURL: interaction.user.displayAvatarURL()})
                 .setTimestamp();
            await interaction.editReply({embeds: [embed]});
        },
}