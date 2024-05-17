const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnects This Voice Channel'),
        memberVC: true,
        botVC: true,
        sameVoice: true,
        queueNeeded: false,

        async execute(interaction, memberVC, botVC, queue) {
            const { client } = interaction;
            await interaction.deferReply();

            try {
                await client.distube.voices.leave(interaction.guild);
                const leaveEmbed = new EmbedBuilder()
                      .setColor("Red")
                      .setDescription("I\'ve Disconnected From Your Voice Channel.")
                      .setFooter({
                        text: `Commanded By ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                      });

                return await interaction.editReply({embeds: [leaveEmbed]});
            } catch(error) {
                const errorEmbed = new EmbedBuilder()
                      .setColor("Red")
                      .setDescription(error.message.length > 4096 ? error.message.slice(0, 4093) + "..." : error.message)
                      .setFooter({
                        text: `Commanded By ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                      });
            }
        }
}