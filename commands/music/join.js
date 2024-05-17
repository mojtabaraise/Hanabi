const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const { queueNeeded } = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Joins A Voice Channel'),
        memberVC: true,
        botVC: false,
        sameVoice: true,
        queueNeeded: false,

        async execute(interaction, memberVC, botVC, queue) {
            await interaction.deferReply();
            const { client, options } = interaction;
            if ((memberVC && botVC) && memberVC.id === botVC.id) {
                const inVoiceEmbed = new EmbedBuilder()
                      .setColor("Red")
                      .setDescription("❗ I\'m Already Connected To Your Voice Channel.")
                      .setFooter({
                        text: `Commanded By ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                      });

                return await interaction.editReply({embeds: [inVoiceEmbed]});
            };

            try {
                await client.distube.join(memberVC);

                const joinEmbed = new Discord.EmbedBuilder()
                      .setColor(config.MainColor)
                      .setDescription("I\'ve Connected To Your Voice Channel.")
                      .setFooter({
                        text: `Commanded By ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                      });

                return await interaction.editReply({embeds: [joinEmbed]});
            } catch(error) {
                const errorEmbed = new EmbedBuilder()
                      .setColor("Red")
                      .setDescription(error.message.length > 4096 ? error.message.slice(0, 4093) + "..." : error.message)
                      .setFooter({
                        text: `Commanded By ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                      });

                return await interaction.editReply({embeds: [errorEmbed]});
            };
        }
}