const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { SUPPORT_CH_ID, FEEDBACK_CH_ID, RESOLVED_TAG, MODERATOR_ROLE } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
      .setName("closepost")
      .setDescription("Closes a post"),
    async execute(interaction) {
        if (!interaction.channel.isThread()) {
            return interaction.reply({ content: "This command can only be used in a thread.", flags: 64 });
        }

        if (!interaction.member.roles.cache.has(MODERATOR_ROLE)) {
            return interaction.reply({ content: "You do not have permission to use this command.", flags: 64 });
        }

        const thread = interaction.channel;
        const createdTimestamp = thread.createdTimestamp;
        const now = Date.now();
        const duration = Math.floor((now - createdTimestamp) / 1000);
        const messageCount = (await thread.messages.fetch()).size;
        const memberCount = thread.memberCount;

        const seconds = duration % 60;
        const minutes = Math.floor((duration % 3600) / 60);
        const hours = Math.floor((duration % 86400) / 3600);
        const days = Math.floor(duration / 86400);

        let durationText = '';
        if (days > 0) durationText += `${days} day(s) `;
        if (hours > 0) durationText += `${hours} hour(s) `;
        if (minutes > 0) durationText += `${minutes} minute(s) `;
        if (seconds > 0) durationText += `${seconds} second(s)`;

        let embed;

        if (thread.parentId === SUPPORT_CH_ID) {
            embed = new EmbedBuilder()
                .setTitle("Zoe Support | Post closed")
                .setThumbnail("https://cdn.discordapp.com/attachments/1179434091964285042/1198376353679020203/Zoe_1.jpg?ex=678a20b3&is=6788cf33&hm=4dd8a343cac7dbbd19fe2ba3ba6f28b06d4637513bf831d885d624bca3563c94&")
                .setDescription("Thank you for getting in touch! We hope that your issue has been resolved to your satisfaction. If not, you can reopen this post at any time. \n If you have any feedback or suggestions to make the Zoe even better, you can do so here: https://discord.com/channels/554578876811182082/1022225273002926090 \nIf you love Zoe as much as we do, please let others know what you think. Thank you and have a great day!")
                .setColor(0xd2722f)
                .addFields(
                    { name: "Post statistics", value: `:hourglass: Post open for: ${durationText}\n:envelope: Messages sent: ${messageCount} messages` },
                )
                .setFooter({
                    text: "Zoe Helper by @timfernix",
                    iconURL: "https://i.imgur.com/BmUvnFG.jpeg",
                });
        } else if (thread.parentId === FEEDBACK_CH_ID) {
            embed = new EmbedBuilder()
                .setTitle("Zoe Feedback | Post closed")
                .setThumbnail("https://cdn.discordapp.com/attachments/1179434091964285042/1198376353679020203/Zoe_1.jpg?ex=678a20b3&is=6788cf33&hm=4dd8a343cac7dbbd19fe2ba3ba6f28b06d4637513bf831d885d624bca3563c94&")
                .setDescription("Thank you for your feedback! We appreciate you taking the time to share your thoughts with us. Your input helps us make Zoe even better. We're thrilled to have you as part of our community.\nHave a good day!")
                .setColor(0xd2722f)
                .addFields(
                    { name: "Post statistics", value: `:hourglass: Post open for: ${durationText}\n:envelope: Messages sent: ${messageCount} messages` },
                )
                .setFooter({
                    text: "Zoe Helper by @timfernix",
                    iconURL: "https://i.imgur.com/BmUvnFG.jpeg",
                });
        } else {
            return interaction.reply({ content: "This command cannot be used here.", flags: 64 });
        }

        await interaction.channel.send({ embeds: [embed] });
        await interaction.reply({ content: `Thread will be archived in 30 seconds.`, flags: 64 });

        for (let i = 25; i >= 0; i -= 5) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            await interaction.editReply({ content: `Thread will be archived in ${i} seconds.` });
        }

        await interaction.editReply({ content: `Thread has been archived.` });

        const existingTags = thread.appliedTags;
        if (!existingTags.includes(RESOLVED_TAG)) {
            existingTags.push(RESOLVED_TAG);
        }
        await thread.setAppliedTags(existingTags);

        await thread.setArchived(true);
    }
}
