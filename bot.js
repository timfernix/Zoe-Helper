require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const { TOKEN, SERVERID, SUPPORT_CH_ID, FEEDBACK_CH_ID } = process.env;
const {
  GatewayIntentBits,
  Client,
  Events,
  Collection,
  ActivityType,
  EmbedBuilder
} = require("discord.js");

const optionInfochannel = ["info", "panel", "card", "gameinfo", "gameoverview"];
const optionRankchannel = ["rankchannel", "ranked", "lp"];
const optionClashchannel = ["clash", "clashchannel"];
const optionLeaderboard = ["leaderboard"];
const optionMatchhistorychannel = ["matchhistory", "history"];
const optionRankrole = ["role", "rankrole"];
const optionSubscription = ["premium", "subscription", "benefit", "kofi", "boost", "subscribe", "point"];
const optionRefresh = ["refresh", "update", "updating", "stopped", "loading", "lag", "crash"];
const optionError = ["error", "failed"];
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
      `[WARNING] The command at ${filePath} is missing a required "data" of "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

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
      ephemeral: true,
    });
  }
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  client.user.setActivity({
    name: "over the Server | v2.1",
    type: ActivityType.Watching,
  });
});

function createEmbed(title, description) {
  return new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

function createEmbed(title, description, extraFieldTitle, extraFieldValue) {
  return new EmbedBuilder()
    .setColor(0xffea00)
    .setTitle(title)
    .setDescription(description)
    .addFields({ name: extraFieldTitle, value: extraFieldValue, inline: true })
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/1179434091964285042/1198376353679020203/Zoe_1.jpg?ex=65beadf3&is=65ac38f3&hm=f659dab70ea493296c01da4e9cafb9cb5dbd909e80cb279cce0878636e143487&"
    )
    .setFooter({
      text: "Zoe Helper by @timfernix | This is an automatically generated message.",
      iconURL:
        "https://cdn.discordapp.com/avatars/589773984447463434/bb159d2c8839d7d534132780c81b83f6.png?size=64",
    })
}

client.on(Events.ThreadCreate, async (thread) => {
  console.time('9 | Embed sent in')
  console.log("----------");
  console.log(`1 | New thread created: ${thread.name} (${thread.id})`);

  if (thread.guild.id !== SERVERID) {
    console.log(`2 | ServerID doesnt match: ${thread.guild.id}`);
    return;
  } else {
    console.log(`2 | ServerID matches: ${thread.guild.id}`);
  }

  const fetchedThread = await thread.fetch();
  console.log(`3 | Fetched new thread: ${fetchedThread.name} (${fetchedThread.id})`);
  let timer = 0;
  const checkMessages = async () => {
    const messages = await fetchedThread.messages.fetch();
    console.log(`4 | Fetched ${messages.size} message(s) from thread ${thread.name} (${thread.id})`);

    if (messages.size === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); //1s delay
      timer = timer + 1;
      console.log(`5 | Looped ${timer} time(s)`);
      return checkMessages();
    }

    const firstMessage = messages.first();
    console.log("6 | Thread message found and fetched");

    try {
      let threadMessage = await firstMessage.content;
      let threadTitle = await thread.name;

      let messageText = `${threadTitle} - ${threadMessage}`
      if (!messageText) {
        console.log("7 | No message text");
      } else {
        console.log(`7 | Message text: ${messageText}`);
      }

      let threadOwner = thread.ownerId;
      let embed;
      if (thread.parentId === SUPPORT_CH_ID) {
        embed = createEmbed(
          "Zoe Support | Post Review - Welcome!",
          "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
          ":satellite: __This might help you based on your post__",
          "*No keywords found* - You can check the [Zoe Wiki](<https://wiki.zoe-discord-bot.ch>) nevertheless."
        );
        console.log("8 | Channel correct: Support");

        // Check for keywords
        let content = messageText.toLowerCase();
        if (optionInfochannel.some((keyword) => content.includes(keyword))) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "The infochannel contains the infopanel and the gamecards. These are deleted after the end of the game (including all other messages in the channel). This leads to problems if you define other channels in this channel. \n\n- [Infochannel](https://wiki.zoe-discord-bot.ch/en/features/infochannel)\n- [Gamecards](https://wiki.zoe-discord-bot.ch/en/features/gamecards)\n- [Infochannel Order](https://wiki.zoe-discord-bot.ch/en/Zoe-Configuration/Infochannel/Infochannel-Order)\n- [Infochannel Rankfilter](https://wiki.zoe-discord-bot.ch/en/Zoe-Configuration/Infochannel/Infochannel-Rankfilter)"
          );
        } else if (
          optionRankchannel.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "Messages about LP wins and losses of players are sent in the rankchannel. If they take some time to be sent, it may be because you have not switched on your discord presence. Placement games are not displayed in the ranked channel.\n\n- [Rankchannel](https://wiki.zoe-discord-bot.ch/en/features/rankchannel)\n- [Rankchannel Filter](https://wiki.zoe-discord-bot.ch/en/Zoe-Configuration/Rankchannel/Rankchannel-Filter)"
          );
        } else if (
          optionClashchannel.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "In the clashchannel you can get tips on picks and bans in clash. For the clashchannel to show a team you have to be in a team with 4 other people.\n\n- [Clashchannel](https://wiki.zoe-discord-bot.ch/en/features/clashchannel)"
          );
        } else if (
          optionLeaderboard.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "In leaderboards, players can compare themselves in different categories. Mastery points / KDA from different accounts are not offset against each other. For ranks, the highest is always displayed. Leaderboards that are too high up in a channel (> 20 messages) cannot be kept up to date by Zoe.\n\n- [Leaderboards](https://wiki.zoe-discord-bot.ch/en/features/leaderboards)"
          );
        } else if (
          optionMatchhistorychannel.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "The matchhistorychannel is an advanced rankchannel that does not show LP changes but the exact match details.\n\n- [Matchhistorychannel](https://wiki.zoe-discord-bot.ch/en/features/matchhistorychannel)"
          );
        } else if (
          optionRankrole.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "Rankroles show the current rank of your players in their Discord profile. You need enough space on your server to set them. With the premium version you can customise them in the smallest detail. They are updated normally like the other features.\n\n- [Rankroles](https://wiki.zoe-discord-bot.ch/en/features/rankroles)"
          );
        } else if (
          optionSubscription.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "If you want to support us, you can do so with a subscription and receive some benefits in return. If you cant use your benefits, this may be due to the following: \n- You have not connected your Discord account to Kofi. \n- Your subscription has expired or has not been automatically renewed. \n- You have not used the /boost command on your server. \n Please note that you must stay on this server to keep your benefits.\n\n- [Support](https://wiki.zoe-discord-bot.ch/en/support)\n- [Zoe Points](https://wiki.zoe-discord-bot.ch/en/Zoe-Points-And-Boosting)\n- [/boost](https://wiki.zoe-discord-bot.ch/en/commands/subscription/boost)\n- [Guide](https://wiki.zoe-discord-bot.ch/en/Guides/Subscription)"
          );
        } else if (
          optionRefresh.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "Your features are not updating? \n If this is the case and occurs acutely, please check in https://discord.com/channels/554578876811182082/554579908270227456 whether a message has already been issued there. If there is nothing there, thank you for your report! \n If it has not been working for some time, please check https://discord.com/channels/554578876811182082/583897341392584715 \n\n- [Refresh](https://wiki.zoe-discord-bot.ch/en/terms/refresh-mode)\n- [/refresh](https://wiki.zoe-discord-bot.ch/en/commands/basic/refresh)"
          );
        } else if (
          optionError.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "You have come across an error, thank you for reporting it, if it is not an permission error it could be something more serious. Thank you for your report."
          );
        } else if (
          optionConfiguration.some((keyword) => content.includes(keyword))
        ) {
          embed = createEmbed(
            "Zoe Support | Post Review - Welcome!",
            "**Thank you <@" + threadOwner + "> for describing your problem.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*\n\nYou can fix simple problems here: https://discord.com/channels/554578876811182082/583897341392584715\nCurrent problems are addressed here: https://discord.com/channels/554578876811182082/554579908270227456\nYou can also take a look at the FAQ: [FAQ](https://wiki.zoe-discord-bot.ch/en/faq)",
            ":satellite: __This might help you based on your post__",
            "Zoe can be customised according to your wishes using the /config command.\n\n- [Configuration](https://wiki.zoe-discord-bot.ch/en/Zoe-Configuration)"
          );
        }
      } else if (thread.parentId === FEEDBACK_CH_ID) {
        embed = createEmbed(
          "Zoe Feedback | Post Review - Welcome!",
          "**Thank you <@" + threadOwner + "> for giving us feedback on Zoe.** \n Here you can review and check the details of your post while we work on it. We will notify you as soon as we can when we reply to you in person. \n\n *Please apologise for any possible waiting time.*",
          ":tools: __Development Status__",
          "If you are interested in what we have planned for the future so far, you can take a look here: [Development Status](https://wiki.zoe-discord-bot.ch/en/Development-Status)"
        );
        console.log("8 | Channel correct: Feedback");
      } else {
        console.log("8 | Channel incorrect, no action taken");
        return;
      }

      if (embed) {
        try {
          await firstMessage.reply({ embeds: [embed] });
          console.timeEnd('9 | Embed sent in')
        } catch (error) {
          console.error(`9 | Failed to send embed: ${error.message}`);
        }
      }
    } catch (error) {
      console.error("10 | Error fetching message:", error);
    }
  };
  await checkMessages();
});

client.login(TOKEN);
