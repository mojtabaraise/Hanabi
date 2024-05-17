const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(["ViewChannel", "SendMessages", "EmbedLinks", "ReadMessageHistory"])) return;
		const command = interaction.client.commands.get(interaction.commandName);
		const {client} = interaction;
		if(command){
			const memberVC = interaction.member.voice.channel || null;
            const botVC = interaction.guild.members.me.voice.channel || null;
            const queue = client.distube.getQueue(interaction.guild) || null;
			if(command.memberVC) {
				if (!memberVC) return await interaction.reply({ content: 'You Aren\'t Connected To Any Voice Channel.', ephemeral: true });
			};

			if(command.botVC) {
				if (!botVC) return await interaction.reply({ content: 'I\'m not connected to any Voice Chnanel.', ephemeral: true });
			};

			if(command.sameVoice) {
				if ((memberVC && botVC) && memberVC.id !== botVC.id) return await interaction.reply({ content: 'You Aren\'t Connected To My Voice Channel.', ephemeral: true });
			};

			if(command.queueNeeded) {
				if (!queue) return await interaction.reply({ content: 'I\'m Not Playing Anything Right Now.', ephemeral: true });
			};

			try {
				await command.execute(interaction, memberVC, botVC, queue);
			} catch (error) {
				const embed = new EmbedBuilder().setTitle("Error").setColor("Red").setDescription(`:octagonal_sign: Error Has Accured During Executing This Command!`).setThumbnail('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freeiconspng.com%2Fimages%2Ferror-icon&psig=AOvVaw1Va5iJr4xXYmEH2UXi9Tus&ust=1713004372671000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPi3xNu8vIUDFQAAAAAdAAAAABAR');
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ embeds: [embed], ephemeral: true });
				} else {
					await interaction.reply({ embeds: [embed], ephemeral: true });
				}
			}
		}
	},
};