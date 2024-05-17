const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, parseEmoji} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stealemoji')
		.setDescription('You Can Steal Emoji From Other Servers!')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEmojisAndStickers)
        .addStringOption((option) =>
            option.setName('emoji')
            .setDescription('The Emoji You Want To Steal')
            .setRequired(true))
            .addStringOption((option) => 
            option.setName('name')
            .setDescription('The Name Of The Emoji')
            .setRequired(false)),
	async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) return await interaction.reply({content: "You Don't Have Permission To Do That!\nPermission: **Manage Emojis & Stickers**", ephemeral: true})
        let emoji = interaction.options.getString('emoji').trim();
        const emojid = parseEmoji(emoji)
        const name = interaction.options.getString('name') || emojid.name;
        if(emoji.startsWith('<') && emoji.endsWith('>')) {
            const id = emojid.id;
        let type;
        if(emojid.animated) {
            type = "gif";
        }else{
            type = "png";
        }

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
        }
        if (!emoji.startsWith('http')) {
            return await interaction.reply({content: "You Want Default Emoji In Your Server?! :neutral_face:", ephemeral: true})
        }
        if (!emoji.startsWith('https')) {
            return await interaction.reply({content: "You Want Default Emoji In Your Server?! :neutral_face:", ephemeral: true})
        }

        interaction.guild.emojis.create({attachment: `${emoji}`, name: name}).then(emoji => {
            const embeda = new EmbedBuilder().setTitle('Emoji +').setColor('Green').setDescription(`Successfully Added ${emoji} To Your Server With Name: **${name}**`);
            return interaction.reply({embeds: [embeda]})
        }).catch(err => {
            interaction.reply({content: "You Have Reached Limit Of Server Emojis!", ephemeral: true})
        });
    },
};