const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { logchannel1, logchannel2, logchannel3, serverid1, serverid2, serverid3 } = require('../../config.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a Member In Your Server')
        .addUserOption(option => option.setName('user').setDescription('Target User That You Want To Ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The Reason You Want To Ban').setRequired(false)),

        async execute(interaction, client) {
            const { options, user } = interaction;
            const target = options.getUser('user');
            const reasong = options.getString('reason') || "No reason provided";
            const reason = `Banned By ${user.username} | Reason: ${reasong}`;
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                await interaction.reply({content: `You Don't Have Permission To Ban Members!`})
            } else if(interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                const ID = target.id;
                const banUser = interaction.client.users.cache.get(ID);
                if(interaction.member.id == ID) return await interaction.reply({content: `You Can't Ban Yourself!`, ephemeral: true});
                if(interaction.client.user.id == ID) return await interaction.reply({content: `I Can't Ban Myself :neutral_face:`, ephemeral: true})
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
                const emacc = new EmbedBuilder().setTitle('Ban').setColor('Red').setDescription(`:no_entry_sign: Are You Sure You Want To Ban **${target.username}** ?`).setFooter({text: user.username, iconURL: user.displayAvatarURL()}).setTimestamp();
                const bandem = new EmbedBuilder().setTitle('Banned').setColor('Green').setDescription(`Successfully Banned **${target.username}** For reason: **${reasong}**`).setFooter({text: user.username, iconURL: user.displayAvatarURL()}).setTimestamp();
                const cancedem = new EmbedBuilder().setTitle('Canceled').setColor('Red').setDescription(`Successfully Canceled Banning Process`).setFooter({text: user.username, iconURL: user.displayAvatarURL()}).setTimestamp();
                const logbanem = new EmbedBuilder().setTitle('Ban Log').setColor('Blurple').setDescription(`Someone Got Banned!`).addFields({name: `Banned Member:`, value: `${target.username} | ${target.id}`}).addFields({name: `Moderator:`, value: `${user.username} | ${user.id}`}).addFields({name: `Reason:`, value: reasong}).setTimestamp();
                const message = await interaction.reply({ embeds: [emacc], components: [buttonacc]})
                const collectorFilter = i => i.user.id === interaction.user.id;
                try {
                    const confirmation = await message.awaitMessageComponent({ filter: collectorFilter, time: 10_000 });
                    if(confirmation.customId == "cancb") {
                        await interaction.editReply({content: ``, embeds: [cancedem], components: []})
                        await wait(5_000);
                        await interaction.deleteReply();
                    } else if(confirmation.customId == "confb") {
                        const channellogse1 = await interaction.client.channels.cache.get(logchannel1);
                        const channellogse2 = await interaction.client.channels.cache.get(logchannel2);
                        const channellogse3 = await interaction.client.channels.cache.get(logchannel3);
                        await interaction.guild.bans.create(banUser, {reason}).then(async response => {
                            let sv = interaction.guild.id;
                            if(sv == serverid1) {
                                await channellogse1.send({embeds: [logbanem]});
                            }else if(sv == serverid2) {
                                await channellogse2.send({embeds: [logbanem]});
                            }else if(sv == serverid3) {
                                await channellogse3.send({embeds: [logbanem]});
                            }
                            await interaction.editReply({content: ``, embeds: [bandem], components: []});
                        }).catch(async err => {
                            await interaction.editReply({content: `I Can't Ban This Member! Maybe My Role Is Lower Than Him Or I Don't Have Permission`, embeds: [], components: []});
                            await wait(2_500);
                            await interaction.deleteReply();
                        });
                    }
                } catch (e) {
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