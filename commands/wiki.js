const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const cheerio = require("cheerio");

const choices = {
  infochannel: {
    url: "https://wiki.zoe-discord-bot.ch/en/features/infochannel",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_infochannel.png",
  },
  gamecards: {
    url: "https://wiki.zoe-discord-bot.ch/en/features/gamecards",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_gamecard.png",
  },
  "champion analysis": {
    url: "https://wiki.zoe-discord-bot.ch/en/features/champion-analysis",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/champion_analysis.png",
  },
  rankchannel: {
    url: "https://wiki.zoe-discord-bot.ch/en/features/rankchannel",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_rankchannel_message.png",
  },
  leaderboards: {
    url: "https://wiki.zoe-discord-bot.ch/en/features/leaderboards",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_leaderboard_championmasterypoints.png",
  },
  clashchannel: {
    url: "https://wiki.zoe-discord-bot.ch/en/features/clashchannel",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_clashchannel_active.png",
  },
  matchhistorychannel: {
    url: "https://wiki.zoe-discord-bot.ch/en/features/matchhistorychannel",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_matchhistorychannel_message_extended.png",
  },
  rankroles: {
    url: "https://wiki.zoe-discord-bot.ch/en/features/rankroles",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/basic_rankroles_6.png",
  },
  "stats profile": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/stats/profile",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_stats_profile.png",
  },
  "stats teamanalysis": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/stats/teamAnalysis",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_stats_teamanalysis_picks.png",
  },
  "stats matchhistory": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/stats/matchhistory",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_stats_matchhistory_overview.png",
  },
  "stats rankupdate": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/stats/rankupdate",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_stats_rankupdate.png",
  },
  "stats predictrole": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/stats/predictrole",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_predictrole_suggestion.png",
  },
  "refresh command": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/basic/refresh",
    customText: "When you execute the command your server is updated manually. More specifically, the cache is also updated (which normally happens every 24 hours). The refresh command refreshes the infochannel, rankchannel, leaderboards, matchhistorychannel and rankroles.",
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_refresh_command.gif",
  },
  "help command": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/basic/help",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_help_command_example.png",
  },
  "setup command": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/administrative/setup",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_setup_command.gif",
  },
  "language command": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/administrative/language",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_language.gif",
  },
  "config command": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/administrative/config",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_config_1.png",
  },
  "reset command": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/administrative/reset",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_reset_command_3.png",
  },
  "patchnotes command": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/administrative/patchnotes",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_patchnotes.png",
  },
  "rawserverdata command": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/administrative/rawserverdata",
    customText: "When you execute this command, Zoe sends you a text message with the raw data of the players of your server. You will receive the following information about all of your players: Teamname (if they were in one), Discord ID, Discord username, Server region, Riot ID, Rank, Division, LP and Rank value.",
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_rawserverdata_output.png",
  },
  "create infochannel": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/infochannel/create",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_create_infochannel.gif",
  },
  "delete infochannel": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/infochannel/delete",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_delete_infochannel.gif",
  },
  "define infochannel": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/infochannel/define",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_define_infochannel.gif",
  },
  "undefine infochannel": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/infochannel/undefine",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_undefine_infochannel.gif",
  },
  "create rankchannel": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/rankchannel/create",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_create_rankchannel.gif",
  },
  "delete rankchannel": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/rankchannel/delete",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_delete_rankchannel.gif",
  },
  "define rankchannel": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/rankchannel/define",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_define_rankchannel.gif",
  },
  "undefine rankchannel": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/rankchannel/undefine",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_undefine_rankchannel.gif",
  },
  "create clashchannel": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/clashchannel/create",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_create_clashchannel_riotid_1.png",
  },
  "delete clashchannel": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/clashchannel/delete",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_delete_clashchannel.gif",
  },
  "clash refresh": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/clashchannel/refresh",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_clashrefresh.gif",
  },
  "clash analysis": {
    url: "http://wiki.zoe-discord-bot.ch/en/commands/clashchannel/analysis",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_clash_analysis.png",
  },
  "create matchhistorychannel": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/matchhistorychannel/create",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_create_matchhistorychannel.gif",
  },
  "delete matchhistorychannel": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/matchhistorychannel/delete",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_delete_matchhistorychannel.gif",
  },
  "create leaderboard": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/leaderboard/create",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_create_leaderboard.gif",
  },
  "delete leaderboard": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/leaderboard/delete",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/new_delete_leaderboard.gif",
  },
  "register command": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/player/register",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_register_riotid.png",
  },
  "create player": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/player/create",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_create_player_riotid.png",
  },
  "delete player": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/player/delete",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_delete_player_user.png",
  },
  "show players": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/player/show-players",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_show_players_all.png",
  },
  "add account": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/player/addaccount",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_add_account_riotid.png",
  },
  "remove account": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/player/removeaccount",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_remove_account_riotid.png",
  },
  "banaccount": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/player/banaccount",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_banaccount_riotid.png",
  },
  "create team": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/team/create",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_create_team.png",
  },
  "delete team": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/team/delete",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_delete_team.png",
  },
  "add playertoteam": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/team/addplayer",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_add_playertoteam.png",
  },
  "remove playerfromteam": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/team/removeplayer",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_remove_player.png",
  },
  "show team": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/team/show",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_showteam.png",
  },
  "join command": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/team/join",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_join_team.png",
  },
  "leave command": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/team/leave",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_leave_team.png",
  },
  "boost command": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/subscription/boost",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_boost_command.gif",
  },
  "subscription command": {
    url: "https://wiki.zoe-discord-bot.ch/en/commands/subscription/subscription",
    customText: 0,
    imageUrl: "https://wiki.zoe-discord-bot.ch/en_/en_subscription_command.gif",
  },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wiki")
    .setDescription("Search the Zoe Wiki for information")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Word to search for")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const filtered = Object.keys(choices).filter((choice) =>
      choice.toLowerCase().startsWith(focusedValue.toLowerCase())
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction) {
    const query = interaction.options.getString("query");
    const choice = choices[query];

    if (!choice) {
      await interaction.reply({
        content: 'No results found for your query. Please try a different keyword.',
        flags: 64,
      });
      return
    }

    if (choice.customText != 0) {
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setAuthor({
          name: `Zoe Wiki - ${query}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1179434091964285042/1198376353679020203/Zoe_1.jpg",
        })
        .setDescription(choice.customText)
        .addFields({
            name: "Zoe Wiki Link",
            value: `[Click here](${choice.url})`,
            })
        .setImage(choice.imageUrl)
        .setFooter({
          text: "Zoe Helper by @timfernix | Accessing Zoe Wiki",
          iconURL: "https://i.imgur.com/BmUvnFG.jpeg",
        });

      await interaction.reply({ embeds: [embed] });
      return;
    } else if (choice.customText === 0) {
      const url = choice.url;
      const selector = "#information + p";

      try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const scrapedText = $(selector).text().trim();

        if (scrapedText.length > 4096) {
          scrapedText = scrapedText.substring(0, 4093) + "...";
        }

        if (scrapedText) {
          const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setAuthor({
              name: `Zoe Wiki - ${query}`,
              iconURL:
                "https://cdn.discordapp.com/attachments/1179434091964285042/1198376353679020203/Zoe_1.jpg",
            })
            .setDescription(scrapedText)
            .addFields({
                name: "Zoe Wiki Link",
                value: `[Click here](${choice.url})`,
              })
            .setImage(choice.imageUrl)
            .setFooter({
              text: "Zoe Helper by @timfernix | Accessing Zoe Wiki",
              iconURL: "https://i.imgur.com/BmUvnFG.jpeg",
            });

          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({
            content: 'Error while fetching Zoe wiki page. Please try again later.',
            flags: 64,
          });
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'Error while fetching Zoe wiki page. Please try again later.',
          flags: 64,
        });
      }
    }
  },
};
