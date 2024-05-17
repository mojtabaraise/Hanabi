const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the current song."),
  memberVC: true,
  botVC: true,
  sameVoice: true,
  queueNeeded: true,

  async execute(interaction, memberVC, botVC, queue) {
   
    await interaction.deferReply();

    if (queue.playing) {

      const pauseEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription("Queue Isn't Paused.")
        .setFooter({
          text: `Commanded By ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 })
        });

      return await interaction.editReply({ embeds: [pauseEmbed] });

    };

    try {

      await queue.resume();

      const pauseEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription("Resumed The Song For You.")
        .setFooter({
          text: `Commanded By ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 })
        });

      return await interaction.editReply({ embeds: [pauseEmbed] });

    } catch (error) {

      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(error.message.length > 4096 ? error.message.slice(0, 4093) + "..." : error.message)
        .setFooter({
          text: `Commanded By ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 })
        });

      return await interaction.editReply({ embeds: [errorEmbed] });

    };

  },

};