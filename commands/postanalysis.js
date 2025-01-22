const { EmbedBuilder, ChannelType } = require("discord.js");
const { MODERATOR_ROLE } = process.env;

module.exports = {
  data: {
    name: "postanalysis",
    description: "Analyzes the most frequently used words",
    options: [
      {
        name: "channel_id",
        type: 3,
        description: "The ID of the channel to analyze",
        required: true,
      },
    ],
    toJSON() {
      return {
        name: this.name,
        description: this.description,
        options: this.options,
      };
    },
  },
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(MODERATOR_ROLE)) {
      return interaction.reply(
        "You do not have the required role to use this command."
      );
    }

    const channelId = interaction.options.getString("channel_id");

    if (!channelId) {
      return interaction.reply("Please provide a channel ID.");
    }

    const channel = await interaction.client.channels.fetch(channelId);

    if (!channel || channel.type !== ChannelType.GuildForum) {
      return interaction.reply(
        "Invalid channel ID or the channel is not a forum channel."
      );
    }

    const activeThreads = await channel.threads.fetchActive();
    const archivedThreads = await channel.threads.fetchArchived({ limit: 100 });
    const allThreads = [
      ...activeThreads.threads.values(),
      ...archivedThreads.threads.values(),
    ];

    const wordCount = {};
    let threadCount = 0;
    let lastThreadCreationDate = null;

    await interaction.reply("Starting analysis...");

    for (const thread of allThreads) {
      threadCount++;
      const messages = await thread.messages.fetch();
      const words = thread.name.split(/\s+/);
      words.forEach((word) => {
        word = word.toLowerCase();
        if (word && word.trim()) {
          if (wordCount[word]) {
            wordCount[word]++;
          } else {
            wordCount[word] = 1;
          }
        }
      });

      messages.forEach((msg) => {
        const words = msg.content.split(/\s+/);
        words.forEach((word) => {
          word = word.toLowerCase();
          if (word && word.trim()) {
            if (wordCount[word]) {
              wordCount[word]++;
            } else {
              wordCount[word] = 1;
            }
          }
        });
      });

      lastThreadCreationDate = thread.createdAt;

      if (threadCount % 10 === 0) {
        const progress = Math.round((threadCount / allThreads.length) * 100);
        const progressBar =
          "█".repeat(progress / 5) + "░".repeat(20 - progress / 5);
        await interaction.editReply(
          `<:ZoeUpdate:1112362751206105169> Analyzed ${threadCount} threads so far...\n[${progressBar}] ${progress}%`
        );
      }
    }

    const excludedWords = [
      "the", "to", "i", "you", "a", "it", "and", "in", "is", "for", "can", 
      "that", "if", "on", "not", "have", "this", "be", "your", "but", 
      "of", "are", "we", "with", "my", "do", "hey", "just", "me", "was", 
      "no", "will", "should", "so", "all", "how", "try", "any", "use", 
      "like", "see", "an", "as", "at", "by", "he", "she", "they", "them", 
      "its", "from", "or", "which", "what", "where", "when", "why", "who", 
      "there", "their", "than", "these", "those", "then", "also", "about", 
      "up", "down", "out", "over", "under", "more", "less", "into", "very", 
      "some", "most", "such", "through", "again", "much", "many", "before", 
      "after", "now", "yet", "too", "still", "once"
    ];
    const filteredWordCount = Object.entries(wordCount).filter(
      ([word]) => !excludedWords.includes(word)
    );
    const sortedWords = filteredWordCount.sort((a, b) => b[1] - a[1]);
    const topWords = sortedWords.slice(0, 60);
    const totalWords = Object.values(wordCount).reduce((a, b) => a + b, 0);

    const embed = new EmbedBuilder()
      .setTitle(
        `${threadCount} Threads | Last: ${lastThreadCreationDate.toDateString()}`
      )
      .setColor(0x00ae86)
      .setFooter({
        text: "Word Frequency Analysis",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setDescription(`Total words analyzed: ${totalWords}`);

    for (let i = 0; i < 3; i++) {
      const wordsSlice = topWords
        .slice(i * 20, (i + 1) * 20)
        .map(([word, count]) => `**${word}**: ${count}`)
        .join("\n");
      embed.addFields({
        name: `__Top Words ${i * 20 + 1}-${(i + 1) * 20}__`,
        value: wordsSlice,
        inline: true,
      });
    }

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
