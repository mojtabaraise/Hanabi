const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows Bot\'s Help Menu'),

    async execute(interaction) {
        const embed1 = new EmbedBuilder()
              .setTitle('Help Center')
              .setDescription('Main Help Center')
              .setColor('Green')
              .addFields({name: 'Moderation Commands', value: `All Moderation Commands`})
              .addFields({name: `Utility Commands`, value: `All Utility Commands`})
              .addFields({name: `Music Commands`, value: `All Music Commands`})
              .addFields({name: `Warn Commands`, value: `All Warn Commands`});

        const embed2 = new EmbedBuilder()
              .setDescription('Moderation Help Center')
              .setColor('Green')
              .addFields({name: '/ban', value: `bans a member`})
              .addFields({name: `/unban`, value: `unbans a user`})
              .addFields({name: `/kick`, value: `kicks a member`})
              .addFields({name: `/clear`, value: `clears messages in channel`})
              .addFields({name: `/slowmode`, value: `sets slowmode to a channel`})
              .addFields({name: `/lock`, value: `locks a channel`})
              .addFields({name: `/unlock`, value: `unlocks a channel to everyone can send message`})
              .addFields({name: `/stealemoji`, value: `steals a emoji from another server`})
              .setFooter({text: `Moderation Commands`})
              .setTimestamp();

        const embed3 = new EmbedBuilder()
              .setDescription('Utility Help Center')
              .setColor('Green')
              .addFields({name: '/help', value: `Shows This Menu Again`})
              .addFields({name: `/ping`, value: `Shows Bot's Latency`})
              .setFooter({text: `Utility Commands`})
              .setTimestamp();

        const embed4 = new EmbedBuilder()
              .setDescription('Music Help Center')
              .setColor('Green')
              .addFields({name: 'Working...', value: `Under Constructing...`})
              .setFooter({text: `Music Commands`})
              .setTimestamp();

        const embed5 = new EmbedBuilder()
              .setDescription('Warn Help Center')
              .setColor('Green')
              .addFields({name: '/warn add', value: `Adds A Warn To A User`})
              .addFields({name: `/warn delete`, value: `Removes Warns Of A User`})
              .addFields({name: `/warn list`, value: `Shows A List Of User's Warns(s)`})
              .setFooter({text: `Warn Commands`})
              .setTimestamp();

        //=====================================================================================

        const select = new StringSelectMenuBuilder()
              .setCustomId('helpselect')
              .setPlaceholder('Help Menu')
              .addOptions(
                new StringSelectMenuOptionBuilder()
                   .setLabel('Main Help Center')
                   .setDescription('Shows Main Help Center Menu')
                   .setValue('e1'),
                new StringSelectMenuOptionBuilder()
                   .setLabel('Moderation Help Center')
                   .setDescription('Shows Moderation Help Center Menu')
                   .setValue('e2'),
                new StringSelectMenuOptionBuilder()
                   .setLabel('Utility Help Center')
                   .setDescription('Shows Utility Help Center Menu')
                   .setValue('e3'),
                new StringSelectMenuOptionBuilder()
                   .setLabel('Music Help Center')
                   .setDescription('Shows Music Help Center Menu')
                   .setValue('e4'),
                new StringSelectMenuOptionBuilder()
                   .setLabel('Warn Help Center')
                   .setDescription('Shows Warn Help Center Menu')
                   .setValue('e5'),
              );

              const row = new ActionRowBuilder().addComponents(select);

              const message = await interaction.reply({embeds: [embed1], components: [row]})

              const collector = await message.createMessageComponentCollector();

              collector.on('collect', async i => {
                if(i.values[0] == "e1") {
                    if(i.user.id !== interaction.user.id) {
                        return await i.reply({content: `You Can't Use This Select Menu, If You Want To Use Just Send /help`})
                    }
                    i.update({embeds: [embed1], components: [row]})
                }
                if(i.values[0] == "e2") {
                    if(i.user.id !== interaction.user.id) {
                        return await i.reply({content: `You Can't Use This Select Menu, If You Want To Use Just Send /help`})
                    }
                    i.update({embeds: [embed2], components: [row]})
                }
                if(i.values[0] == "e3") {
                    if(i.user.id !== interaction.user.id) {
                        return await i.reply({content: `You Can't Use This Select Menu, If You Want To Use Just Send /help`})
                    }
                    i.update({embeds: [embed3], components: [row]})
                }
                if(i.values[0] == "e4") {
                    if(i.user.id !== interaction.user.id) {
                        return await i.reply({content: `You Can't Use This Select Menu, If You Want To Use Just Send /help`})
                    }
                    i.update({embeds: [embed4], components: [row]})
                }
                if(i.values[0] == "e5") {
                    if(i.user.id !== interaction.user.id) {
                        return await i.reply({content: `You Can't Use This Select Menu, If You Want To Use Just Send /help`})
                    }
                    i.update({embeds: [embed5], components: [row]})
                }
              })

    }
}