const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears Messages')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addNumberOption((option) =>
            option.setName('number')
            .setDescription('between 1 to 99')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(99))
        .addChannelOption(option =>
            option.setName('target-channel')
            .setDescription('The Channel You Want To Clear Messages')
            .setRequired(false)),
	async execute(interaction) {
        const tedad = interaction.options.getNumber('number');
        const channel = interaction.options.getChannel('target-channel') || interaction.channel;
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)){
            await interaction.reply({content: `You Can't Do That!`, ephemeral: true});
        }else if(interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)){
            if(tedad < 1 || tedad > 99){
                interaction.reply({content: `You Can Delete 1 to 99 Messages In One Command Using!`, ephemeral: true});
            }else{
                await channel.bulkDelete(tedad, true).then(async (messages) => {
                    const embed = new EmbedBuilder().setTitle("Cleared").setColor("Green").setDescription(`Successfully Cleared ${tedad} Messages In <#${channel.id}>`);
                    await interaction.reply({embeds: [embed], ephemeral: true});
                });
            }
        }
    },
};