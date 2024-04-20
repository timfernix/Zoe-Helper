const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const textStorage = require('../textStorage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Displays information about the bot.'),

    run: async ({interaction, client, handler}) => {
        function gTbK(key) {
            return textStorage[key];
          }
       
          const embedAbout = new EmbedBuilder()
          .setTitle('Zoe Helper Bot - About')
          .setDescription(gTbK('aboutDesc'))
          .setColor(0xFFEA00)
          .setThumbnail(gTbK('thumbnailLink'));
             
          return interaction.reply({embeds: [embedAbout]});
    },

    options: {
        //devOnly: bool,
        //userPermissions: ['Perm'],
        //botPermission: ['Perm'],
        //deleted: bool,
      }
};