const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows current pings of the bot.'),

  run: async ({interaction, client, handler}) => {
      await interaction.deferReply();
      const reply = await interaction.fetchReply();
      const ping = reply.createdTimestamp - interaction.createdTimestamp;

      const embedPing = new EmbedBuilder()
      .setTitle('Zoe Helper Bot - Ping')
      .setDescription(`:desktop: **Client:** ${ping}ms \n:satellite: **Websocket:** ${client.ws.ping}ms`)
      .setColor(0xFFEA00)
         
      return interaction.editReply({embeds: [embedPing]});
    },
  options: {
    //devOnly: bool,
    //userPermissions: ['Perm'],
    //botPermission: ['Perm'],
    //deleted: bool,
  }
};



