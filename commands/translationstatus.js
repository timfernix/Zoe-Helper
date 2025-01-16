const axios = require('axios');
const cheerio = require('cheerio');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'translationstatus',
        description: 'Shows the Zoe translation status.',
        toJSON() {
            return {
                name: this.name,
                description: this.description,
            };
        },
    },
    async execute(message, args) {
        const url = 'https://translate.zoe-discord-bot.ch/engage/zoe-discord-bot/';

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);

            const strings = $('div.col-md-4:contains("Strings")').find('strong').text();
            const languages = $('div.col-md-4:contains("Languages")').find('strong').text();
            const translatedPercentage = $('div.col-md-4:contains("Translated")').find('strong').text();

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Zoe Translation Status')
                .setURL(url)
                .setImage('https://translate.zoe-discord-bot.ch/widgets/zoe-discord-bot/-/zoe-discord-bot/open-graph.png')
                .setDescription(`Zoe is currently **${translatedPercentage} translated**.\nThe project has **${strings} total strings**, \nthat need to be translated in **${languages} languages**.\n\n If you want to learn more about translating, \n check the [translation wiki page](https://wiki.zoe-discord-bot.ch/en/translation).`);

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('There was an error retrieving the translation status. Please try again later.');
        }
    },
};
