const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops Playing Music"),

        memberVC: true,
        botVC: true,
        sameVoice: true,
        queueNeeded: true,

        async execute(interaction, memberVC, botVC, queue){
            await interaction.deferReply();

            try {
                await queue.stop();

                const stopEmbed = new EmbedBuilder()
                     .setColor("Blurple")
                     .setDescription("Stopped Playing.")
                     .setFooter({
                       text: `Commanded By ${interaction.user.tag}`,
                       iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                     });
                return await interaction.editReply({ embeds: [stopEmbed] });
            } catch (error) {
                const errorEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(error.message.length > 4096 ? error.message.slice(0, 4093) + "..." : error.message)
                    .setFooter({
                      text: `Commanded By ${interaction.user.tag}`,
                      iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                    });

                return await interaction.editReply({ embeds: [errorEmbed] });
            }
        }
}