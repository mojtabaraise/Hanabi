const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays A Song')
        .addStringOption(option => option.setName('query').setDescription('Song URL Or Song Name To Play').setRequired(true)),

        memberVC: true,
        botVC: false,
        sameVoice: true,
        queueNeeded: false,

        async execute(interaction, memberVC, botVC, queue) {

            const { client, options } = interaction;
            const query = options.getString('query');
            await interaction.deferReply({ephemeral: true});
            const searchEmbed = new EmbedBuilder()
                  .setColor("Blurple")
                  .setDescription("Searching...")
                  .setFooter({
                    text: `Commanded By ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                  });
            await interaction.editReply({embeds: [searchEmbed]});
            try {

                client.distube.play(memberVC, query, {
                    member: interaction.member,
                    textChannel: interaction.channel
                });
            } catch(error) {
                const errorEmbed = new EmbedBuilder()
                      .setColor("Blurple")
                      .setDescription(error.message.length > 4096 ? error.message.slice(0, 4093) + "..." : error.message)
                      .setFooter({
                        text: `Commanded By ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ size: 1024 })
                      });
            };
        }
}