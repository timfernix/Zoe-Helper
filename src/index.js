require('dotenv').config();
const { Client, IntentsBitField, ActivityType, Attachment } = require('discord.js');
const { CommandKit } = require('commandkit')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});


new CommandKit({
  client,
  eventsPath: `${__dirname}/events`,
  commandsPath: `${__dirname}/commands`,
  bulkRegister: false,
});

client.login(process.env.TOKEN);