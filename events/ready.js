const { Events, ActivityType } = require('discord.js');
const mongoose = require("mongoose");
const mongodburl = require("../config.json").mongourl;

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        if(!mongodburl) return;
		await mongoose.connect(mongodburl || '')

		if(mongoose.connect) {
			console.log('Successfully connected to mongodb')
		}
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setStatus('online');
		client.user.setActivity('Hanabi Bot Is Here', { type: ActivityType.Listening });
	},
};