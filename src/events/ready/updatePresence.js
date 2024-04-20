const {ActivityType} = require('discord.js')

module.exports = (c, client, handler) => {
    client.user.setActivity({
        name: 'over the Server',
        type: ActivityType.Watching,
      })
  };

