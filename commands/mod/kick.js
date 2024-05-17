const { SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { logchannel1, logchannel2, logchannel3, serverid1, serverid2, serverid3 } = require('../../config.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks A Member From Your Server')
        .addUserOption(option => option.setName('user').setDescription('Target User To Kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The Reason You Want To Kick Someone').setRequired(false)),

        async execute(interaction) {
            const { options, user, client} = interaction;
            const target = options.getUser('user');
            const kickmember = await interaction.guild.members.fetch(target.id)
            const reasone = options.getString('reason') || "No Reason Provided";
            const reason = `Kicked By ${user.username} | Reason: ${reasone}`;

            if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                await interaction.reply({content: `You Don't Have Permission To Kick Members!`})
            }else if(interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            if(user.id == target.id) return await interaction.reply({content: `You Can't Kick Yourself!`, ephemeral: true});
            if(target.id == client.user.id) return await interaction.reply({content: `I Can't Kick Myself!`, ephemeral: true});
            if(!kickmember) return await interaction.reply({content: `This User Is No Longer In Server To Kick!`, ephemeral: true});
            if(!kickmember.kickable) return await interaction.reply({content: `I Can't Kick This Member Because He Has A Role That Is Higher Than Me Or You!`, ephemeral: true});
            const buttonacc = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('confb')
                    .setLabel('Confirm')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancb')
                    .setLabel('Cancel')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Secondary)
            );
            const emacc = new EmbedBuilder().setTitle('Kick').setColor('Red').setDescription(`:no_entry_sign: Are You Sure You Want To Kick **${target.username}** ?`).setFooter({text: user.username, iconURL: user.displayAvatarURL()}).setTimestamp();
            const kickdem = new EmbedBuilder().setTitle('Kicked').setColor('Green').setDescription(`Successfully Kicked **${target.username}** For Reason: **${reasone}**`).setFooter({text: user.username, iconURL: user.displayAvatarURL()}).setTimestamp();
            const cancedem = new EmbedBuilder().setTitle('Canceled').setColor('Red').setDescription(`Successfully Canceled Kicking Process`).setFooter({text: user.username, iconURL: user.displayAvatarURL()}).setTimestamp();
            const logkickem = new EmbedBuilder().setTitle('Kick Log').setColor('Blurple').setDescription(`Someone Got Kicked!`).addFields({name: `Kicked Member:`, value: `${target.username} | ${target.id}`}).addFields({name: `Moderator:`, value: `${user.username} | ${user.id}`}).addFields({name: `Reason:`, value: reasone}).setTimestamp();
            const message = await interaction.reply({ embeds: [emacc], components: [buttonacc]});
            const collectorFilter = i => i.user.id === interaction.user.id;
            try {
                const confirmation = await message.awaitMessageComponent({ filter: collectorFilter, time: 10_000 });
                if(confirmation.customId == "cancb") {
                    await interaction.editReply({content: ``, embeds: [cancedem], components: []})
                    await wait(3_500);
                    await interaction.deleteReply();
                } else if(confirmation.customId == "confb") {
                    await kickmember.kick({reason: reason}).then(async res => {
                        const channellogse1 = await interaction.client.channels.cache.get(logchannel1);
                        const channellogse2 = await interaction.client.channels.cache.get(logchannel2);
                        const channellogse3 = await interaction.client.channels.cache.get(logchannel3);
                        let sv = interaction.guild.id;
                            if(sv == serverid1) {
                                await channellogse1.send({embeds: [logkickem]});
                            }else if(sv == serverid2) {
                                await channellogse2.send({embeds: [logkickem]});
                            }else if(sv == serverid3) {
                                await channellogse3.send({embeds: [logkickem]});
                            }
                        await interaction.editReply({embeds: [kickdem], components: []});
                    }).catch( async err => {
                        interaction.editReply({content: `An Error Has Accured During Kicking The User`, embeds: [], components: []})
                    })
                }
            } catch(e) {
                if(e == "InteractionCollectorError"){
                    await interaction.editReply({ content: 'Confirmation not received within 10 Seconds, cancelling', components: [], embeds: [] });
                    await wait(5_000);
                    await interaction.deleteReply();
                    } else {
                        await interaction.editReply({ content: 'Confirmation not received within 10 Seconds, cancelling', components: [], embeds: [] });
                        await wait(5_000);
                        await interaction.deleteReply();
                    }
            }
            }
        }
}