const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const func = require('../../utils/functions');

module.exports = {
    data: new SlashCommandBuilder()
              .setName('volume')
              .setDescription('Sets Volume Of Player')
              .addNumberOption(option => 
                option.setName('volume')
                .setDescription('Enter New Volume Without %')
                .setRequired(true)),

    memberVC: true,
    botVC: true,
    sameVoice: true,
    queueNeeded: true,

    async execute(interaction, memberVC, botVC, queue) {
        const { client, options } = interaction;
        
        await interaction.deferReply();
        const volume = options.getNumber('volume');

        try {
            await queue.setVolume(volume);
            const volumeEmbed = new EmbedBuilder()
                  .setColor("Blurple")
                  .setDescription(`Volume Changed To \`${volume}\`\n\n${func.queueStatus(queue)}`)
                  .setFooter({
                      text: `Commanded By ${interaction.user.tag}`,
                      iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                  });

            return await interaction.editReply({ embeds: [volumeEmbed]});
        } catch(error) {
            const errorEmbed = new EmbedBuilder()
                  .setColor("Red")
                  .setDescription(error.message.length > 4096 ? error.message.slice(0, 4093) + "..." : error.message)
                  .setFooter({
                    text: `Commanded By ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                  });

            return await interaction.editReply({ embeds: [errorEmbed]});
        };
    }
}