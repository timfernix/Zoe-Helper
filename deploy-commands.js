require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");

const { TOKEN, APPLICATION_ID, GUILD_ID } = process.env;

if (!TOKEN || !APPLICATION_ID || !GUILD_ID) {
  console.error("Missing required environment variables. Please check your .env file.");
  process.exit(1);
}

const commands = [];

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && typeof command.data.toJSON === 'function') {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`Command at ./commands/${file} is missing a valid "data" property.`);
  }
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application commands.`
    );

    const data = await rest.put(
      Routes.applicationCommands(APPLICATION_ID),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
