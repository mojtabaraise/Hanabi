const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const ascii = require('ascii-table');
let table = new ascii("Commands");
table.setHeading("Command", "Status");
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { DisTube } = require('distube');
const func = require('./utils/functions');
const { row2, row3 } = require('./utils/components');

const { token, emoji } = require('./config.json');

// DISCORD BOT

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages,] });

// Slash Commands Loader
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

console.log("Loading Commands...")
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			table.addRow(file, 'OK');
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			table.addRow(file, '[warning] Missing Some Neccesary Code!');
		}
	}
}
console.log(table.toString());


// Events Loader
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log("Loading Events...")
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Music Player
client.distube = new DisTube(client, {  // DisTube client constructor
    // Change these on your risk! more info https://distube.js.org/#/docs/DisTube/stable/typedef/DisTubeOptions

    emitNewSongOnly: false,                 // Whether or not emitting DisTube#event:playSong event when looping a song or next song is the same as the previous one
    leaveOnEmpty: true,                     // Whether or not leaving voice channel if the voice channel is empty after DisTubeOptions.emptyCooldown seconds.
    leaveOnFinish: false,                   // Whether or not leaving voice channel when the queue ends.
    leaveOnStop: true,                      // Whether or not leaving voice channel after using DisTube#stop function.
    savePreviousSongs: true,                // Whether or not saving the previous songs of the queue and enable DisTube#previous method
    searchSongs: 5,                         // Limit of search results emits in DisTube#event:searchResult event when DisTube#play method executed. If searchSongs <= 1, play the first result
    searchCooldown: 30,                     // Built-in search cooldown in seconds (When searchSongs is bigger than 0)
    // youtubeCookie: '',                   // YouTube cookies. Read how to get it in YTDL's Example
    // youtubeIdentityToken: '',            // If not given; ytdl-core will try to find it. You can find this by going to a video's watch page; viewing the source; and searching for "ID_TOKEN".
    // customFilters: { },                  // Override defaultFilters or add more ffmpeg filters. Example={ "Filter name"="Filter value"; "8d"="apulsator=hz=0.075" }
    // ytdlOptions: { },                    // ytdl-core get info options
    emptyCooldown: 60,                      // Built-in leave on empty cooldown in seconds (When leaveOnEmpty is true)
    nsfw: false,                            // Whether or not playing age-restricted content and disabling safe search in non-NSFW channel.
    emitAddListWhenCreatingQueue: true,     // Whether or not emitting addList event when creating a new Queue
    emitAddSongWhenCreatingQueue: true,     // Whether or not emitting addSong event when creating a new Queue
    joinNewVoiceChannel: false,             // Whether or not joining the new voice channel when using DisTube#play method
    // streamType: DisTubeStream#type,      // Decide the DisTubeStream#type will be used (Not the same as DisTubeStream#type)
    directLink: true,                       // Whether or not play direct link of the song
    plugins: [                              // DisTube plugins.
        new SpotifyPlugin(),                // Spotify plugin.
        new SoundCloudPlugin(),             // SoundCloud plugin.
        new YtDlpPlugin()                   // yt-dlp plugin for supporting 700+ sites.
    ]

})
client.distube.on('playSong', async (queue, song) => {
	const voiceChannel = queue.distube.client.channels.cache.get(queue.voice.channelId);
	const voiceChannelMembers = voiceChannel.members.filter(member => !member.user.bot);

	const embed = new EmbedBuilder()
	      .setColor('Blurple')
		  .setDescription(`Now Playing **[${song.name} (${song.formattedDuration})](${song.url})** for ${voiceChannelMembers.size} ${voiceChannelMembers.size > 1 ? 'listeners' : 'listener'} in ${voiceChannel}`)
		  .setThumbnail(song?.thumbnail)
		  .setFooter({
			text: `Requested By ${song.user.tag}`,
			iconURL: song.user.displayAvatarURL()
		  });

		  if(song.views) embed.addFields({
			name: `👀 Views:`,
			value: `${func.numberWithCommas(song.views)}`,
			inline: true
		  });
		  if(song.likes) embed.addFields({
			name: `👍🏻 Likes:`,
			value: `${func.numberWithCommas(song.likes)}`,
			inline: true
		  });
		  if(song.dislikes) embed.addFields({
			text: `👎🏻 Dislikes:`,
			value: `${func.numberWithCommas(song.dislikes)}`,
			inline: true
		  });
		const reply = await queue.textChannel?.send({embeds: [embed], components: [row2, row3]});

		const collector = await reply.createMessageComponentCollector({time: song.duration * 1000});

		collector.on('collect', async (int) => {
			console.log(int);

			const memberVC = int.member.voice.channel || null;
			const botVC = int.guild.members.me.voice.channel || null;

			if ((memberVC && botVC) && memberVC.id !== botVC.id) {
				const inVoiceEmbed = new EmbedBuilder()
				      .setColor("Red")
					  .setDescription(`You Aren't In My Voice Channel To Do That!`);

				return await int.reply({embeds: [inVoiceEmbed], ephemeral: true})
			}

			await int.deferReply()

			try{


				if(int.customId == "filters") {
					if(queue.filters.has(int.values[0])) {
						await queue.filters.remove(int.values[0])
					}else{
						await queue.filters.add(int.vlues[0])
					};

					await reply.edit({components: [row2, row3]});

					const filtersEmbed = new EmbedBuilder()
					      .setColor("Blurple")
						  .setDescription(`**Current Queue Filters:** \`${queue.filters.names.join(', ') || 'OFF'}\`\n\n${func.queueStatus(queue)}`)
						  .setFooter({text: `Commanded By ${int.user.tag}`, iconURL: int.user.displayAvatarURL()});


					return await int.editReply({embeds: [filtersEmbed]});
				}else if(int.customId.startsWith('loop')) {
					const loopState = int.customId.split('-')[1];
					const currentLoopState = queue.repeatMode;
					const convertedLoopState = {
						0: "off",
						1: "song",
						2: "queue"
					};

					let mode = 0;

					if(convertedLoopState[currentLoopState] === "off") {
						if(loopState === "song") mode = 1;
						else if(loopState === "queue") mode = 2;
					}else {
						if (loopState !== convertedLoopState[currentLoopState]) {
							if(loopState === "song") mode = 1;
							else if(loopState === "queue") mode = 2;
						}
					}
					mode = await queue.setRepeatMode(mode);
					mode = mode ? (mode === 2 ? 'All Queue' : 'This Song') : 'Off';
	
					const loopEmbed = new EmbedBuilder()
						  .setColor('Blurple')
						  .setDescription(`Loop Mode Changed To \`${mode}\`\n\n${func.queueStatus(queue)}`)
						  .setFooter({text: `Commanded By ${int.user.tag}`, iconURL: int.user.displayAvatarURL()});
					
					return await int.editReply({embeds: [loopEmbed]});
				}else if(int.customId == 'previous') {
					await queue.previous()
					const skippedEmbed = new EmbedBuilder()
					      .setColor('Blurple')
						  .setDescription('Skipping To Previous Song...')
						  .setFooter({text: `Commanded By ${int.user.tag}`, iconURL: int.user.displayAvatarURL()});
					await int.editReply({embeds: [skippedEmbed]});
					return await collector.stop()
				}else if(int.customId == 'pauseUnpause') {
					if(queue.playing){
						await queue.pause();
					}else{
						queue.resume();
					};

					const pauseUnpauseEmbed = new EmbedBuilder()
					      .setColor("Blurple")
						  .setDescription(`${queue.playing ? 'Resumed': 'Paused'} The Song For You`)
						  .setFooter({text: `Commanded By ${int.user.tag}`, iconURL: int.user.displayAvatarURL()});
					return await int.editReply({embeds: [pauseUnpauseEmbed]});
				}else if(int.customId == 'next') {
					await queue.skip();

                    const skippedEmbed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription("Skipping To The Next Song...")
                        .setFooter({
                            text: `Commanded By ${int.user.tag}`,
                            iconURL: int.user.displayAvatarURL({ size: 1024 })
                        });

                    await int.editReply({ embeds: [skippedEmbed] });

                    return await collector.stop();
				}else if(int.customId.startsWith('vol')){
					const volumeUpDown = int.customId.split('-')[1];

                    if (volumeUpDown === 'up') await queue.setVolume(queue.volume + 10);
                    else if (volumeUpDown === 'down') await queue.setVolume(queue.volume - 10);

                    const volumeEmbed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription(`Volume Changed To \`${queue.volume}\`\n\n${func.queueStatus(queue)}`)
                        .setFooter({
                            text: `Commanded By ${int.user.tag}`,
                            iconURL: int.user.displayAvatarURL({ size: 1024 })
                        });

                    return await int.editReply({ embeds: [volumeEmbed] });
				}else if(int.customId == 'backward'){
					await queue.seek(queue.currentTime - 10);

                    const seekEmbed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription(`Backwarded The Song For 10 Seconds.`)
                        .setFooter({
                            text: `Commanded By ${int.user.tag}`,
                            iconURL: int.user.displayAvatarURL({ size: 1024 })
                        });

                    return await int.editReply({ embeds: [seekEmbed] });
				}else if(int.customId == 'stop'){
					await queue.stop();

                    const stopEmbed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription("Stopped Playing...")
                        .setFooter({
                            text: `Commanded By ${int.user.tag}`,
                            iconURL: int.user.displayAvatarURL({ size: 1024 })
                        });

                    await int.editReply({ embeds: [stopEmbed] });

                    return await collector.stop();
				}else if(int.customId == 'forward'){
					await queue.seek(queue.currentTime + 10);

                    const seekEmbed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription(`Forwarded The Song For 10 Seconds.`)
                        .setFooter({
                            text: `Commanded By ${int.user.tag}`,
                            iconURL: int.user.displayAvatarURL({ size: 1024 })
                        });

                    return await int.editReply({ embeds: [seekEmbed] });
				}
			}catch (error){
				const errorEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(error.message.length > 4096 ? error.message.slice(0, 4093) + "..." : error.message)
                    .setFooter({
                        text: `Commanded By ${int.user.tag}`,
                        iconURL: int.user.displayAvatarURL({ size: 1024 })
                    });
					console.log(error);
                return await int.editReply({ embeds: [errorEmbed] });
			}
		});
		collector.on('end', async (collection, reason) => {

            if (["messageDelete", "messageDeleteBulk"].includes(reason)) return;
            await reply.edit({ components: [] }).catch(() => null);

        });
}).on('addSong', async (queue, song) => {
	const embed = new EmbedBuilder().setColor('Blurple').setDescription(`New song added to the queue\n**Song:** [${song.name} (${song.formattedDuration})](${song.url})`).setFooter({text: `Commanded by ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ size: 1024 })});
	await queue.textChannel?.send({embeds: [embed]});
}).on('addList', async (queue, playlist) => {
	const embed = new EmbedBuilder().setColor("Blurple").setDescription(`New playlist to the queue\n**Playlist:** ${playlist.name} (${playlist.songs.length} songs)`).setFooter({text: `Commanded by ${playlist.songs[0].user.tag}`, iconURL: playlist.songs[0].user.displayAvatarURL({ size: 1024 })});
	await queue.textChannel?.send({embeds: [embed]})
}).on('error', async (channel, e) => {
	const embed = new EmbedBuilder().setColor('Red').setDescription(e.message.length > 4096 ? e.message.slice(0, 4093) + '...' : e.message);
	await channel?.send({embeds: [embed]});
}).on('empty', async (queue) => {
	const embed = new EmbedBuilder().setColor("Red").setDescription("The Voice Channel Is Empty! Leaving Voice Channel...");
	await queue.textChannel?.send({embeds: [embed]});
}).on('noRelated', async (queue) => {
	const embed = new EmbedBuilder().setColor('Red').setDescription('Can\'t Find Related Song To Play');
	await queue.textChannel?.send({embeds: [embed]});
}).on('searchCancel', async (message) => {
	const embed = new EmbedBuilder().setColor('Red').setDescription('Searching Canceled').setFooter({text: `Commanded by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ size: 1024 })});
	await message.reply({embeds: [embed]});
}).on('searchDone', () => {})
.on('searchInvalidAnswer', async (message) => {
	const embed = new EmbedBuilder().setColor('Red').setDescription("Invalid Number Of Result").setFooter({text: `Commanded by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ size: 1024 })});
	await message.reply({embeds: [embed]});
}).on('searchResult', async (message, result) => {
	let i = 0;
	const embed = new EmbedBuilder().setColor("Blurple").setTitle("Choose An Option From Below").setDescription(`${result.map(song => `**${++i}**. ${song.name} (${song.formattedDuration})`).join('\n')}\n\n*Enter anything else or wait 30 seconds to cancel!*`).setFooter({text: `Commanded By ${message.author.tag}`, iconURL: message.author.displayAvatarURL()});
	await message.reply({embeds: [embed]});
}).on('searchNoResult', async (message) => {
	const embed = new EmbedBuilder().setColor('Red').setDescription('No Result Found').setFooter({text: `Commanded By ${message.author.tag}`, iconURL: message.author.displayAvatarURL()});
	message.reply({embeds: [embed]});
})

// Anti Crash
process.on('unhandledRejection', (reason, p) => {
    console.log('[antiCrash] :: Unhandled Rejection/Catch');
    console.log(reason?.stack, p);
});

process.on("uncaughtException", (err, origin) => {
    console.log('[antiCrash] :: Uncaught Exception/Catch');
    console.log(err?.stack, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
    console.log(err?.stack, origin);
});

client.login(token);