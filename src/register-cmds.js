require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'about',
    description: 'Shows you basic information about the bot.',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started registering cmds');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Cmds were registered!');
  } catch (error) {
    console.log(`An error occured: ${error}`);
  }
})();