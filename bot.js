require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { exec } = require("child_process");
const Parser = require("rss-parser");
const parser = new Parser();
let postedRSSmessages = new Set();
const RSSfile = "./data/rss.json";

const { TOKEN, GUILD_ID, SUPPORT_CH_ID, FEEDBACK_CH_ID, TRANSLATION_CH_ID, APPLICATION_ID } =  process.env;
const { GatewayIntentBits, Client, Events, Collection, ActivityType, EmbedBuilder } = require("discord.js");

const optionInfochannel = ["info", "panel", "card", "gameinfo", "gameoverview"];
const optionRankchannel = ["rankchannel", "ranked", "lp"];
const optionClashchannel = ["clash", "clashchannel"];
const optionLeaderboard = ["leaderboard"];
const optionMatchhistorychannel = ["matchhistory", "history"];
const optionRankrole = ["role", "rankrole"];
const optionSubscription = ["premium", "subscription", "benefit", "kofi", "boost", "subscribe", "point"];
const optionRefresh = ["refresh", "update", "updating", "stopped", "loading", "lag", "crash", "bug"];
const optionError = ["error", "failed", "problem"];
const optionConfiguration = ["config", "setting"];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

exec("node deploy-commands.js", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing deploy-commands.js: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "There was an error while executing this command",
        flags: 64,
      });
    }
  } else if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found`);
      return;
    }

    try {
      const input = interaction.options.getFocused();
      if (!input || typeof input !== "string" || input.length < 1) {
        await interaction.respond([]);
        return;
      }

      await command.autocomplete(interaction);
    } catch (error) {
      console.log(error);
      await interaction.respond([
        {
          name: "There was an error while processing this autocomplete request",
          value: "error",
        },
      ]);
    }
  }
});

function loadPostedGuids() {
  if (fs.existsSync(RSSfile)) {
    try {
      const data = fs.readFileSync(RSSfile, "utf8");
      postedRSSmessages = new Set(JSON.parse(data));
      console.log(`Loaded ${postedRSSmessages.size} RSS messages from file.`);
    } catch (err) {
      console.error(`Failed to load RSS messages: ${err}`);
      postedRSSmessages = new Set();
    }
  } else {
    console.log("RSS file does not exist. Starting with an empty set.");
    postedRSSmessages = new Set();
  }
}

function savePostedGuids() {
  try {
    fs.writeFileSync(RSSfile, JSON.stringify([...postedRSSmessages], null, 2));
    console.log(`Saved ${postedRSSmessages.size} RSS messages to file.`);
  } catch (err) {
    console.error(`Failed to save RSS messages: ${err}`);
  }
}

async function fetchRSS() {
  try {
    const feed = await parser.parseURL(
      "https://translate.zoe-discord-bot.ch/exports/rss/zoe-discord-bot/zoe-discord-bot/"
    );
    const rsschannel = await client.channels.fetch(TRANSLATION_CH_ID);

    const oldestFirst = feed.items.reverse();

    oldestFirst.forEach((item) => {
      const pubDate = new Date(item.pubDate).toISOString();
      if (!postedRSSmessages.has(pubDate)) {
        postedRSSmessages.add(pubDate);
        savePostedGuids();

        const creatorRegex = /<a href="\/user\/([^"]+)" .*?>([^<]+)<\/a>/i;
        const match = item.creator ? item.creator.match(creatorRegex) : null;
        let authorLink = "System";
        if (match && match[1]) {
          authorLink = `[${match[2]}](https://translate.zoe-discord-bot.ch/user/${match[1]})`;
        }

        let rssID;
        if (item.guid === "https://translate.zoe-discord-bot.ch/projects/zoe-discord-bot/zoe-discord-bot/") {
          rssID = "Translation Changes";
        } else {
          rssID = item.guid.split("=").pop();
        }
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "Zoe Translation - Weblate",
            iconURL:
              "https://pbs.twimg.com/profile_images/1140722234543222784/azsIQqB5_400x400.png",
            url: "https://translate.zoe-discord-bot.ch/",
          })
          .setTitle(item.title || "Weblate activity")
          .setDescription(
            `**Author:** ${authorLink}\n**String:** [${rssID}](${item.guid})\n\n${
              item.contentSnippet || "No description"
            }`
          )
          .setTimestamp(new Date(item.pubDate))
          .setFooter({ text: `Zoe Helper by timfernix | ` });

        rsschannel.send({ embeds: [embed] });
      }
    });
  } catch (error) {
    console.error("Failed to fetch RSS feed:", error);
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  loadPostedGuids();
  setInterval(fetchRSS, 10 * 60 * 1); //5 min

  client.user.setActivity({
    name: "over the Server | v2.4",
    type: ActivityType.Watching,
  });
});

function createEmbed(title, description, extraFieldTitle, extraFieldValue) {
  return new EmbedBuilder()
    .setColor(0xd2722f)
    .setTitle(title)
    .setDescription(description)
    .addFields({ name: extraFieldTitle, value: extraFieldValue, inline: true })
    .setThumbnail("https://cdn.discordapp.com/attachments/1179434091964285042/1198376353679020203/Zoe_1.jpg?ex=678a20b3&is=6788cf33&hm=4dd8a343cac7dbbd19fe2ba3ba6f28b06d4637513bf831d885d624bca3563c94&")
    .setFooter({
      text: "Zoe Helper by @timfernix | This is an automatically generated message.",
      iconURL: "https://i.imgur.com/BmUvnFG.jpeg",
    });
}

client.on(Events.ThreadCreate, async (thread) => {
  console.time("10| DM sent after");
  console.log("----------");
  console.log(`1 | New thread created: ${thread.name} (${thread.id})`);

  if (thread.guild.id !== GUILD_ID) {
    console.log(`2 | ServerID doesnt match: ${thread.guild.id}`);
    return;
  } else {
    console.log(`2 | ServerID matches: ${thread.guild.id}`);
  }

  const fetchedThread = await thread.fetch();
  console.log(
    `3 | Fetched new thread: ${fetchedThread.name} (${fetchedThread.id})`
  );
  let timer = 0;
  const checkMessages = async () => {
    const messages = await fetchedThread.messages.fetch();
    console.log(
      `4 | Fetched ${messages.size} message(s) from thread ${thread.name} (${thread.id})`
    );

    if (messages.size === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      timer = timer + 1;
      console.log(`5 | Looped ${timer} time(s)`);
      return checkMessages();
    } else {
      console.log(`5 | Passed the loop`);
    }

    const firstMessage = messages.first();
    console.log("6 | Thread message found and fetched");

    try {
      let threadMessage = await firstMessage.content;
      let threadTitle = await thread.name;

      let messageText = `${threadTitle} - ${threadMessage}`;
      if (!messageText) {
        console.log("7 | No message text");
      } else {
        let consoleText =
          messageText.length > 50
            ? messageText.substring(0, 50) + "..."
            : messageText;
        console.log(`7 | Message text: ${consoleText}`);
      }

      let threadOwner;
      if (thread.ownerId === APPLICATION_ID) {
          const message = await thread.fetchStarterMessage();
          const mention = message.content.match(/^<@!?(\d+)>/);
          if (mention) {
              threadOwner = mention[1];
          } else {
              threadOwner = thread.ownerId;
          }
      } else {
          threadOwner = thread.ownerId;
      }
  
      let embed;
      if (thread.parentId === SUPPORT_CH_ID) {
        const supportTitle = "Zoe Support | Post Review - Welcome!";
        const supportDescription ="**Thank you <@" + threadOwner + "> for describing your problem.** \nHere you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n*We apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)";
        const supportExtraFieldTitle =":satellite: __This might help you based on your post__";

        embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
          "*No keywords found* - You can always have a look at the [Zoe Wiki](<https://wiki.zoe-discord-bot.ch>)."
        );
        console.log("8 | Channel correct: Support");

        let content = messageText.toLowerCase();
        if (optionInfochannel.some((keyword) => content.includes(keyword))) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "The infochannel contains the infopanel and the gamecards. These are deleted after the end of the game (including all other messages in the channel). This leads to problems if you define other channels in this channel. \n\n- [Infochannel](https://wiki.zoe-discord-bot.ch/en/features/infochannel)\n- [Gamecards](https://wiki.zoe-discord-bot.ch/en/features/gamecards)\n- [Infochannel Order](https://wiki.zoe-discord-bot.ch/en/Zoe-Configuration/Infochannel/Infochannel-Order)\n- [Infochannel Rankfilter](https://wiki.zoe-discord-bot.ch/en/Zoe-Configuration/Infochannel/Infochannel-Rankfilter)"
          );
        } else if (
          optionRankchannel.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "Messages about LP wins and losses of players are sent in the rankchannel. If they take some time to be sent, it may be because you have not switched on your discord presence. Placement games are not displayed in the ranked channel.\n\n- [Rankchannel](https://wiki.zoe-discord-bot.ch/en/features/rankchannel)\n- [Rankchannel Filter](https://wiki.zoe-discord-bot.ch/en/Zoe-Configuration/Rankchannel/Rankchannel-Filter)"
          );
        } else if (
          optionClashchannel.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "In the clashchannel you can get tips on picks and bans in clash. For the clashchannel to show a team you have to be in a team with 4 other people.\n\n- [Clashchannel](https://wiki.zoe-discord-bot.ch/en/features/clashchannel)"
          );
        } else if (
          optionLeaderboard.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "In leaderboards, players can compare themselves in different categories. Mastery points / KDA from different accounts are not offset against each other. For ranks, the highest is always displayed. Leaderboards that are too high up in a channel (> 20 messages) cannot be kept up to date by Zoe.\n\n- [Leaderboards](https://wiki.zoe-discord-bot.ch/en/features/leaderboards)"
          );
        } else if (
          optionMatchhistorychannel.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "The matchhistorychannel is an advanced rankchannel that does not show LP changes but the exact match details.\n\n- [Matchhistorychannel](https://wiki.zoe-discord-bot.ch/en/features/matchhistorychannel)"
          );
        } else if (
          optionRankrole.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "Rankroles show the current rank of your players in their Discord profile. You need enough space on your server to set them. With the premium version you can customise them in the smallest detail. They are updated normally like the other features.\n\n- [Rankroles](https://wiki.zoe-discord-bot.ch/en/features/rankroles)"
          );
        } else if (
          optionSubscription.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "If you want to support us, you can do so with a subscription and receive some benefits in return. If you cant use your benefits, this may be due to the following: \n- You have not connected your Discord account to Kofi. \n- Your subscription has expired or has not been automatically renewed. \n- You have not used the /boost command on your server. \nPlease note that you must stay on this server to keep your benefits.\n\n- [Support](https://wiki.zoe-discord-bot.ch/en/support)\n- [Zoe Points](https://wiki.zoe-discord-bot.ch/en/Zoe-Points-And-Boosting)\n- [/boost](https://wiki.zoe-discord-bot.ch/en/commands/subscription/boost)\n- [Guide](https://wiki.zoe-discord-bot.ch/en/Guides/Subscription)"
          );
        } else if (
          optionRefresh.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "Your features are not updating? \nIf this is the case and occurs acutely, please check in https://discord.com/channels/554578876811182082/554579908270227456 whether a message has already been issued there. If there is nothing there, thank you for your report! \nIf it has not been working for some time, please check https://discord.com/channels/554578876811182082/583897341392584715 \n\n- [Refresh](https://wiki.zoe-discord-bot.ch/en/terms/refresh-mode)\n- [/refresh](https://wiki.zoe-discord-bot.ch/en/commands/basic/refresh)"
          );
        } else if (
          optionError.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "You have come across an error, thank you for reporting it, if it is not an permission error it could be something more serious. Thank you for your report."
          );
        } else if (
          optionConfiguration.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(supportTitle,supportDescription,supportExtraFieldTitle,
            "Zoe can be customised according to your wishes using the /config command.\n\n- [Configuration](https://wiki.zoe-discord-bot.ch/en/Zoe-Configuration)"
          );
        }
      } else if (thread.parentId === FEEDBACK_CH_ID) {
        embed = createEmbed(
          "Zoe Feedback | Post Review - Welcome!",
          "**Thank you <@" + threadOwner + "> for giving us feedback on Zoe.** \nHere you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n*We apologise for any possible waiting time.*",
          ":tools: __Development Status__",
          "If you are interested in what we have planned for the future so far, you can take a look here: [Development Status](https://wiki.zoe-discord-bot.ch/en/Development-Status)"
        );
        console.log("8 | Channel correct: Feedback");
      } else {
        console.log("8 | Channel incorrect, no action taken");
        console.log("----------");
        return;
      }

      if (embed) {
        try {
          await firstMessage.reply({ embeds: [embed] });
          console.log("9 | Embed sent");
        } catch (error) {
          console.error(`9 | Failed to send embed: ${error.message}`);
        }
      }
      const timfernix = await client.users.fetch("589773984447463434");
      await timfernix.send(
        `**__New thread created:__ ${thread.name}**\n__**Message:**__ ${threadMessage}\n__**Link:**__ https://discord.com/channels/${thread.guild.id}/${thread.id}`
      );
      console.timeEnd("10| DM sent after");
      console.log("----------");
    } catch (error) {
      console.error("10| Error fetching message:", error);
    }
  };
  await checkMessages();
});

client.login(TOKEN);
