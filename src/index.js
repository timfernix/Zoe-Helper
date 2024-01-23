require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require('discord.js');
const textStorage = require('./textStorage');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});


client.on('ready', (c) => {
  console.log(`${c.user.tag} is online.`);

  client.user.setActivity({
    name: 'over the Server',
    type: ActivityType.Watching,
  })
});


client.on("threadCreate", async function(thread, id, name, owner){
  console.log(`-----------------------------------------------------------------------------`);
  console.log(`A thread has been created or the client user is added to an existing thread.`);

  const messages = await thread.messages.fetch();

  const threadID = thread.id;
  const threadName = thread.name;
  const threadDesc = messages.first();
  const threadOwner = thread.ownerId;

  console.log("ThreadID: " + threadID);
  console.log("OwnerID: " + threadOwner);
  console.log("Title: " + threadName);
  console.log("Desc: " + threadDesc.content);

  function findTrigger(text, triggerList) {
    const inclTrigger = triggerList.some(word => text.includes(word));

    if (inclTrigger) {
      return triggerList.find(word => text.includes(word));
    }
    else {
      return null; // If no trigger is found
    }
  }
  
  //List of triggers
  const triggers = ['info', 'panel', 'informationpanel', 'gamecard', 'card', 'gameinfo', 'gameoverview', 'rankchannel', 'ranked', 'leaderboard', 'clash', 'clashchannel', 'matchhistory', 'history', 'role', 'rankrole', 'premium', 'subscription', 'benefit', 'kofi', 'boost', 'subscribe', 'point', 'refresh', 'update', 'updating', 'stopped', 'loading', 'lag', 'crash', 'error', 'failed', 'setting', 'config'];
  

  let descText = threadName.toLowerCase() + ' ' + threadDesc.content.toLowerCase();
  console.log('----------')
  console.log('ConvText: ' + descText)
  console.log('----------')
  const trigger = findTrigger(descText, triggers)


  if (trigger) {
    console.log('Trigger found: ' + trigger)

    switch (trigger) {
    // Embeds per trigger: Infochannel
    case 'info':
    case 'panel':
    case 'informationpanel':
    case 'gamecard':
    case 'card':
    case 'gameinfo':
    case 'gameoverview':
      const embed1 = new EmbedBuilder() 
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Infochannel', value: gTbK('infoInfochannel'), inline: true}, {name: 'Wiki Pages', value: gTbK('infoInfochannelWiki'), inline: true})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')}) 

      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed1]})
        }
      else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
        const embedDefaultFeedbackInfo = new EmbedBuilder()
        .setTitle(gTbK('feedbackTitle'))
        .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
        .setColor(0x3498DB)
        .setThumbnail(gTbK('thumbnailLink'))
        .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
          
        console.log('Feedback | Parent channel correct')
        threadDesc.reply({embeds: [embedDefaultFeedbackInfo]})
        break;
        }
      else {      
        console.log('Feedback | Parent channel incorrect')
        break;
      }
    break;

    // Embeds per trigger: Rankchannel
    case 'rankchannel':
    case 'ranked':
    case 'LP':
      const embed2 = new EmbedBuilder()
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Rankchannel', value: gTbK('infoRankchannel'), inline: true}, {name: 'Wiki Pages', value: gTbK('infoRankchannelWiki'), inline: false})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
     
      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed2]})
        }
        else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
          const embedDefaultFeedbackRank = new EmbedBuilder()
          .setTitle(gTbK('feedbackTitle'))
          .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
          .setColor(0x3498DB)
          .setThumbnail(gTbK('thumbnailLink'))
          .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
            
          console.log('Feedback | Parent channel correct')
          threadDesc.reply({embeds: [embedDefaultFeedbackRank]}) 
          }
        else {      
          console.log('Feedback | Parent channel incorrect')
          break;
        }
      break;
  
    // Embeds per trigger: Leaderboards
    case 'leaderboard':
      const embed3 = new EmbedBuilder()
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Leaderboards', value: gTbK('infoLeaderboards'), inline: true}, {name: 'Wiki Pages', value: gTbK('infoLeaderboardsWiki'), inline: true})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
      
      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed3]})
        }
        else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
          const embedDefaultFeedbackLeader = new EmbedBuilder()
          .setTitle(gTbK('feedbackTitle'))
          .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
          .setColor(0x3498DB)
          .setThumbnail(gTbK('thumbnailLink'))
          .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
            
          console.log('Feedback | Parent channel correct')
          threadDesc.reply({embeds: [embedDefaultFeedbackLeader]}) 
          }
        else {      
          console.log('Feedback | Parent channel incorrect')
          break;
        }
      break;
  
    // Embeds per trigger: Clashchannel
    case 'clash':
    case 'clashchannel':
      const embed4 = new EmbedBuilder()
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Clashchannel', value: gTbK('infoClashchannel'), inline: true}, {name: 'Wiki Pages', value: gTbK('infoClashchannelWiki'), inline: true})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
      
      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed4]})
        }
        else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
          const embedDefaultFeedbackClash = new EmbedBuilder()
          .setTitle(gTbK('feedbackTitle'))
          .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
          .setColor(0x3498DB)
          .setThumbnail(gTbK('thumbnailLink'))
        .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
            
          console.log('Feedback | Parent channel correct')
          threadDesc.reply({embeds: [embedDefaultFeedbackClash]}) 
          }
        else {      
          console.log('Feedback | Parent channel incorrect')
          break;
        }
      break;
  
    // Embeds per trigger: Matchhistorychannel
    case 'matchhistory':
    case 'history':
      const embed5 = new EmbedBuilder()
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Matchhistorychannel', value: gTbK('infoMatchhistorychannel'), inline: true}, {name: 'Wiki Pages', value: gTbK('infoMatchhistorychannelWiki'), inline: false})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
      
      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed5]})
        }
        else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
          const embedDefaultFeedbackMhc = new EmbedBuilder()
          .setTitle(gTbK('feedbackTitle'))
          .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
          .setColor(0x3498DB)
          .setThumbnail(gTbK('thumbnailLink'))
          .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
            
          console.log('Feedback | Parent channel correct')
          threadDesc.reply({embeds: [embedDefaultFeedbackMhc]}) 
          }
        else {      
          console.log('Feedback | Parent channel incorrect')
          break;
        }
      break;
  
    // Embeds per trigger: Rankroles
    case 'role':
    case 'rankrole': 
      const embed6 = new EmbedBuilder()
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Rankroles', value: gTbK('infoRankroles'), inline: true}, {name: 'Wiki Pages', value: gTbK('infoRankrolesWiki'), inline: true})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
     
      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed6]})
        }
        else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
          const embedDefaultFeedbackRoles = new EmbedBuilder()
          .setTitle(gTbK('feedbackTitle'))
          .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
          .setColor(0x3498DB)
          .setThumbnail(gTbK('thumbnailLink'))
          .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
            
          console.log('Feedback | Parent channel correct')
          threadDesc.reply({embeds: [embedDefaultFeedbackRoles]}) 
          }
        else {      
          console.log('Feedback | Parent channel incorrect')
          break;
        }
      break;
  
    // Embeds per trigger: Subscription
    case 'premium':
    case 'subscription':     
    case 'benefit':
    case 'kofi':  
    case 'boost':
    case 'subscribe':     
    case 'point':
      const embed7 = new EmbedBuilder()
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Subscription', value: gTbK('infoSubscription'), inline: true}, {name: 'Wiki Pages', value: gTbK('infoSubscriptionWiki'), inline: true})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
     
      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed7]})
        }
        else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
          const embedDefaultFeedbackSub = new EmbedBuilder()
          .setTitle(gTbK('feedbackTitle'))
          .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
          .setColor(0x3498DB)
          .setThumbnail(gTbK('thumbnailLink'))
          .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
            
          console.log('Feedback | Parent channel correct')
          threadDesc.reply({embeds: [embedDefaultFeedbackSub]}) 
          }
        else {      
          console.log('Feedback | Parent channel incorrect')
          break;
        }
      break;
   
    // Embeds per trigger: "Not refreshing"
    case 'refresh':
    case 'update':     
    case 'updating':
    case 'stopped':  
    case 'loading':
    case 'lag':     
    case 'crash':
      const embed8 = new EmbedBuilder()
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Not refreshing', value: gTbK('infoRefresh'), inline: true}, {name: 'Wiki Pages', value: gTbK('infoRefreshWiki'), inline: true})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
      
      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed8]})
        }
        else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
          const embedDefaultFeedbackRefresh = new EmbedBuilder()
          .setTitle(gTbK('feedbackTitle'))
          .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
          .setColor(0x3498DB)
          .setThumbnail(gTbK('thumbnailLink'))
          .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
            
          console.log('Feedback | Parent channel correct')
          threadDesc.reply({embeds: [embedDefaultFeedbackRefresh]}) 
          }
        else {      
          console.log('Feedback | Parent channel incorrect')
          break;
        }
      break;
    
    // Embeds per trigger: "Error"
    case 'error':
    case 'failed':     
      const embed9 = new EmbedBuilder()
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Error', value: gTbK('infoError'), inline: true})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
     
      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed9]})
        }
        else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
          const embedDefaultFeedbackError = new EmbedBuilder()
          .setTitle(gTbK('feedbackTitle'))
          .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
          .setColor(0x3498DB)
          .setThumbnail(gTbK('thumbnailLink'))
          .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
            
          console.log('Feedback | Parent channel correct')
          threadDesc.reply({embeds: [embedDefaultFeedbackError]}) 
          }
        else {      
          console.log('Feedback | Parent channel incorrect')
          break;
        }
      break;
    
    // Embeds per trigger: Config
    case 'setting':
    case 'config':    
      const embed10 = new EmbedBuilder()
      .setTitle(gTbK('supportTitle'))
      .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
      .setColor(0xFFEA00)
      .addFields({name: 'Useful information - Config', value: gTbK('infoConfig'), inline: true}, {name: 'Wiki Pages', value: gTbK('infoConfigWiki'), inline: true})
      .setThumbnail(gTbK('thumbnailLink'))
      .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
     
      if(thread.parentId === process.env.PARENT_SUPPORT_ID){
        console.log('Support | Parent channel correct')
        threadDesc.reply({embeds: [embed10]})
        }
        else if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
          const embedDefaultFeedbackConfig = new EmbedBuilder()
          .setTitle(gTbK('feedbackTitle'))
          .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
          .setColor(0x3498DB)
          .setThumbnail(gTbK('thumbnailLink'))
          .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
            
          console.log('Feedback | Parent channel correct')
          threadDesc.reply({embeds: [embedDefaultFeedbackConfig]}) 
          }
        else {      
          console.log('Feedback | Parent channel incorrect')
          break;
        }
      break;

    // Embed for default
      default:
        const embedDefaultSupport = new EmbedBuilder()
        .setTitle(gTbK('supportTitle'))
        .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
        .setColor(0xFFEA00)
        .setThumbnail(gTbK('thumbnailLink'))
        .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
       
        if(thread.parentId === process.env.PARENT_SUPPORT_ID){
          console.log('Support | Parent channel correct (Default)')
          threadDesc.reply({embeds: [embedDefaultSupport]})
          }
          if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
            const embedDefaultFeedback = new EmbedBuilder()
            .setTitle(gTbK('feedbackTitle'))
            .setDescription('**Thank you <@' + threadOwner + '> for your feedback.** We will notify you as soon as we can when we reply to you in person. Please apologise for any possible waiting time. \n\n If you are interested in what we have planned for the future so far, you can take a look here: [Development Status](https://wiki.zoe-discord-bot.ch/en/Development-Status)')
            .setColor(0xFFEA00)
            .setThumbnail(gTbK('thumbnailLink'))
            .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
                  
            console.log('Feedback | Parent channel correct')
            threadDesc.reply({embeds: [embedDefaultFeedback]}) 
            }
      
            else {      
            console.log('Feedback | Parent channel incorrect')
            break;
          }
        break;

    } //switch close
  } //function close

  else {
    console.log('No trigger found')

    const embedDefaultSupportNoTrigger = new EmbedBuilder()
    .setTitle(gTbK('supportTitle'))
    .setDescription('**Thank you <@' + threadOwner + '> for describing your problem.**' + gTbK('supportDesc'))
    .setColor(0xFFEA00)
    .setThumbnail(gTbK('thumbnailLink'))
    .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
   
    if(thread.parentId === process.env.PARENT_SUPPORT_ID){
      console.log('Support | Parent channel correct (Default)')
      threadDesc.reply({embeds: [embedDefaultSupportNoTrigger]})
      }
      if(thread.parentId === process.env.PARENT_FEEDBACK_ID){
        const embedDefaultFeedbackNoTriggerFeed = new EmbedBuilder()
        .setTitle(gTbK('feedbackTitle'))
        .setDescription('**Thank you <@' + threadOwner + '> for your feedback.**' + gTbK('feedbackDesc'))
        .setColor(0xFFEA00)
        .setThumbnail(gTbK('thumbnailLink'))
        .setFooter({ text: gTbK('footerText'), iconURL: gTbK('footerURL')})
          
        console.log('Feedback | Parent channel correct')
        threadDesc.reply({embeds: [embedDefaultFeedbackNoTriggerFeed]}) 
        }
      else{
        return
      }
  }

});


function gTbK(key) {
  return textStorage[key];
} 


 client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'about') {
    const embedAbout = new EmbedBuilder()
    .setTitle('Zoe Helper Bot - About')
    .setDescription(gTbK('aboutDesc'))
    .setColor(0xFFEA00)
    .setThumbnail(gTbK('thumbnailLink'))
       
    return interaction.reply({embeds: [embedAbout]});
  }

});


client.login(process.env.TOKEN);
