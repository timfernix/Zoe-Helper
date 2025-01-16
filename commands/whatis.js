const {EmbedBuilder} = require('discord.js');

module.exports = {
    data: {
        name: 'whatis',
        description: 'Sends an embed with information about the bot',
        toJSON() {
            return {
                name: this.name,
                description: this.description,
            };
        },
    },
    execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('About Zoe Helper')
            .setDescription('**Zoe Helper** is a small bot that only takes care of some tasks on the Support and Development server of [Zoe the League of Legends Discord Bot](https://discord.com/oauth2/authorize?client_id=550737379460382752&scope=bot&permissions=3490049104&guild_id=0&response_type=code&redirect_uri=https%3A%2F%2Fzoe-discord-bot.ch%2FThanksYou.html).\n\n **Author:** <:timfernix:1265389408585257115><@589773984447463434>\n **Language:** <:nodejs:1265389410795388938>`JavaScript`')
            .setThumbnail('https://cdn.discordapp.com/avatars/1198396680807129158/248dcf46c9f9f037092ced4dff5186aa.png?size=128')

        message.reply({ embeds: [embed] });
    },
};