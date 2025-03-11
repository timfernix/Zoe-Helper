const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guide')
        .setDescription('Provides steps for various things')
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('The type of guide you want to see')
                .setRequired(true)
                .addChoices(
                    { name: 'Other Channel in Infochannel', value: 'infochanneldeletion' },
                    { name: 'Solo/DuoQ Rank in Infopanel', value: 'infopanelrank' },
                    { name: 'Registration with Verification', value: 'registrationwithverification' },
                    { name: 'Remove your account from Zoe', value: 'banaccount' }
                )),
    async execute(interaction) {
        const topic = interaction.options.getString('topic');
        let embed;

        const embedAuthor = { name: 'Zoe Troubleshooting', iconURL: 'https://cdn.discordapp.com/attachments/1179434091964285042/1198376353679020203/Zoe_1.jpg?ex=67974fb3&is=6795fe33&hm=025702a32fae664e210a81db1b94ef7f45a1113d295a85d64602d71f662f5b79&' };
        const embedColor = 0x00AE86;
        const embedFooter = { text: 'Zoe Helper by @timfernix', iconURL: 'https://i.imgur.com/BmUvnFG.jpeg' };

        switch (topic) {
            case 'infochanneldeletion':
                embed = new EmbedBuilder()
                .setAuthor(embedAuthor)
                    .setTitle('Infochannel Message Deletion')
                    .setDescription('Messages in your infochannel are deleted? This is because, all of Zoes messages in the infochannel are automatically deleted. Here are the steps you need to take now:')
                    .addFields(
                        { name: '➤ Step 1', value: 'Check which messages are deleted/look up which channels you set up.' },
                        { name: '➤ Step 2', value: 'Undefine the channel you defined in the infochannel, use [`/undefine rankchannel`](<https://wiki.zoe-discord-bot.ch/en/commands/rankchannel/undefine>) for example.' },
                        { name: '➤ Step 3', value: 'Then create or define the channel you just undefined again with [`/define rankchannel`](https://wiki.zoe-discord-bot.ch/en/commands/rankchannel/delete) or [`/create rankchannel`](https://wiki.zoe-discord-bot.ch/en/commands/rankchannel/create).' },
                        { name: '➤ Step 4', value: 'From now on the messages should no longer be deleted.' }
                    )
                    .setColor(embedColor)
                    .setFooter(embedFooter);
                break;
            case 'infopanelrank':
                embed = new EmbedBuilder()
                .setAuthor(embedAuthor)
                    .setTitle('Change displayed Ranks in Infopanel')
                    .setDescription('If you want to display a specific set of ranks in the infopanel, those are the steps to take:')
                    .addFields(
                        { name: '➤ Step 1', value: 'Use [`/config`](<https://wiki.zoe-discord-bot.ch/en/commands/administrative/config>) to enter Zoes configuration and select the option for :notepad_spiral: **Info Channel Settings**.' },
                        { name: '➤ Step 2', value: 'Select the setting :six: **Infochannel Rank Shown**.' },
                        { name: '➤ Step 3', value: 'In the configuration message select the queue you want to show the rank of in the infopanel and save the setting.' },
                        { name: '➤ Step 4', value: 'From the next refresh on the right ranks should be displayed.' }
                    )
                    .setColor(embedColor)
                    .setFooter(embedFooter);
                break;
            case 'registrationwithverification':
                embed = new EmbedBuilder()
                .setAuthor(embedAuthor)
                    .setTitle('Registration with enabled verification')
                    .setDescription('Youre on a server with enabled verification and want to register? Here are the steps you need to take:\n You can also find this guide more detailed in the [Zoe Wiki](https://wiki.zoe-discord-bot.ch/en/Guides/RegisterWithVerification).')
                    .addFields(
                        { name: '➤ Step 1', value: 'Enter the normal [`/register`](<https://wiki.zoe-discord-bot.ch/en/commands/player/register>) command with your account details.' },
                        { name: '➤ Step 2', value: 'Then you will see the verification message. Open the League of Legends client and log into it.' },
                        { name: '➤ Step 3', value: 'Open your profile and click on your profile icon to change it. Scroll to the bottom of the list and select the one Zoe shows in the verification message.' },
                        { name: '➤ Step 4', value: 'Exit the icon selection screen to save your icon. Now click on the Done button on the verification message and youre done! After that you can change your icon back.' }
                    )
                    .setColor(embedColor)
                    .setFooter(embedFooter);
                break;
                case 'banaccount':
                    embed = new EmbedBuilder()
                    .setAuthor(embedAuthor)
                        .setTitle('Remove your account from Zoe')
                        .setDescription('You want to remove your account from Zoe? Here are the steps you need to take:')
                        .addFields(
                            { name: '➤ Step 1', value: 'Start by issuing the [`/banaccount`](<https://wiki.zoe-discord-bot.ch/en/commands/player/banaccount>) command including your account details.' },
                            { name: '➤ Step 2', value: 'After that you need to verify that the account is yours. Follow the instructions displayed. Log into League and change your profile icon to verify.' },
                            { name: '➤ Step 3', value: 'When this is done, press Done and you will see the list of servers that your account has been added to.' },
                            { name: '➤ Step 4', value: 'You can use the following commands now: \n- `@Zoe kick 3` - Removes your account from the server with the id 3\n- `@Zoe kick all` - Removes your account from all servers its been added to\n- `@Zoe ban` - Restricts everyone to add your account on any server' },
                            { name: 'I want to completely remove my account', value: 'Then use `@Zoe kick all` and `@Zoe ban`.' }
                        )
                        .setColor(embedColor)
                        .setFooter(embedFooter);
                    break;
            default:
                embed = new EmbedBuilder()
                    .setTitle('Unknown Subcommand')
                    .setDescription('Please provide a valid subcommand.')
                    .setColor(0xFF0000);
                break;
        }

        await interaction.reply({ content: 'Embed sent', flags: 64 });
        await interaction.channel.send({ embeds: [embed] });
    },
};
