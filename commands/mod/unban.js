const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { logchannel1, logchannel2, logchannel3, serverid1, serverid2, serverid3 } = require('../../config.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a Member In Your Server')
        .addUserOption(option => option.setName('user').setDescription('Target User That You Want To Unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The Reason You Want To Unban').setRequired(false)),

        async execute(interaction, client) {
            const { options, user } = interaction;
            const targetID = options.getUser('user');
            const reasong = options.getString('reason') || "No reason provided";
            const reason = `Unbanned By ${user.username} | Reason: ${reasong}`;
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                await interaction.reply({content: `You Don't Have Permission To Unban Members!`})
            } else if(interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                if(interaction.member.id == targetID) return await interaction.reply({content: `You Aren't Banned In Your Server!`, ephemeral: true});
                if(interaction.client.user.id == targetID) return await interaction.reply({content: `If You Are Using Me On This Server So I'm Not Banned! :neutral_face:`, ephemeral: true})
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
                const emacc = new EmbedBuilder().setTitle('Unban').setColor('Red').setDescription(`:no_entry_sign: Are You Sure You Want To Unban **${targetID.username}** ?`).setFooter({text: user.username, iconURL: user.displayAvatarURL()}).setTimestamp();
                const unbandem = new EmbedBuilder().setTitle('Banned').setColor('Green').setDescription(`Successfully Unbanned **${targetID.username}** For reason: **${reasong}**`).setFooter({text: user.username, iconURL: user.displayAvatarURL()}).setTimestamp();
                const cancedem = new EmbedBuilder().setTitle('Canceled').setColor('Red').setDescription(`Successfully Canceled Unbanning Process`).setFooter({text: user.username, iconURL: user.displayAvatarURL()}).setTimestamp();
                const logunbanem = new EmbedBuilder().setTitle('Unban Log').setColor('Blurple').setDescription(`Someone Got Unbanned!`).addFields({name: `Unbanned Member:`, value: `${targetID.username} | ${targetID.id}`}).addFields({name: `Moderator:`, value: `${user.username} | ${user.id}`}).addFields({name: `Reason:`, value: reasong}).setTimestamp();
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
                        await interaction.guild.bans.fetch().then( async bans => {
                            if(bans.size == 0) { 
                            await interaction.editReply({content: 'No One Got Banned From This Server!', embeds: [], components: []});
                            await wait(2_500);
                            await interaction.deleteReply();
                        }
                            let bannedID = bans.find(ban => ban.user.id == targetID);
                            if(!bannedID) { 
                                await interaction.editReply({content: 'This ID Isn\'t Banned In This Server!', embeds: [], components: []}); 
                                await wait(2_500); 
                                await interaction.deleteReply();
                            }
                            await interaction.guild.bans.remove(targetID, reason).then(async res => {
                                let sv = interaction.guild.id;
                                if(sv == serverid1) {
                                    await channellogse1.send({embeds: [logunbanem]});
                                }else if(sv == serverid2) {
                                    await channellogse2.send({embeds: [logunbanem]});
                                }else if(sv == serverid3) {
                                    await channellogse3.send({embeds: [logunbanem]});
                                }
                                 interaction.editReply({content: ``, embeds: [unbandem], components: []});
                            }).catch(async err => {
                                await interaction.editReply({content: `I Can't Unban This User!`, embeds: [], components: []});
                                await wait(2_500);
                                await interaction.deleteReply();
                            });
                        })
                    }
                } catch (e) {
                    if(e == "InteractionCollectorError"){
                    await interaction.editReply({ content: 'Confirmation not received within 10 Seconds, cancelling', components: [], embeds: [] });
                    await wait(5_000);
                    await interaction.deleteReply();
                    }
                }
            }
        }
}