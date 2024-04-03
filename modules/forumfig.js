// forumModule.js
const { EmbedBuilder, userMention } = require('discord.js');
const getFig = require('./getFig.js');

const pino= require('pino');
const logger = pino({
	transport: {
	  target: 'pino-pretty',
	  options: {
		colorize: true
	  }
	}
  })

async function postFig(channel, name, id, description, image, author, comment, poster, tags) {
    logger.info("postingFig");
    logger.info("Tags:"+tags);

    logger.info(`author: ${author}`);
    logger.info(author)


    const postEmbed = new EmbedBuilder()
        .setTitle(name)
        .setImage(image)
        .setDescription(description)
        .setURL("https://figgs.ai/chat/" + id)
        .setAuthor(author);
    // .setFooter({ text: "PseudoFigBot by <@623602373809537034>" });

    try {
        const thread = await channel.threads.create({
            name: name,
            autoArchiveDuration: 1440, // 24 hours
            type: 'GUILD_PUBLIC_THREAD',
            appliedTags:tags,
            message: {
                content: `Shared by <@${poster.id}>\n\n${comment}\n`,
                embeds: [postEmbed],

                //  content:"aa"
            }
        }).then(thread => {
           // thread//.send("PseudoFigBot by <@623602373809537034>")
           
            logger.info("taghs in th: "+thread.appliedTags);
            logger.info("tags available: "+thread.avaliableTags);
        });
    } catch (error) {
        logger.error('Error creating thread:', error);
    }
}

async function postFigByLink(link, comment, sfw, channels, poster, tags) {
    const channel = sfw ? channels.sfwChannel : channels.nsfwChannel;

   // const id = link.includes('https://figgs.ai/chat/') ? link.split('=')[1] : link.split('/').pop();
   const id = link.includes('https://www.figgs.ai/chat/') ? link.split('/').pop().split('?')[0] : link; 
   
    logger.info("link id: " + id);
    logger.info('Fetching bot info...');
    const botInfo = await getFig.getBotInfoById(id);

    logger.info('Bot info fetched:', botInfo);
    logger.info(botInfo);
    
    if (botInfo === null) {
        logger.info('Bot not found or server unresponsive');
        throw Error('Bot not found or server unresponsive');
    }
    logger.info('Posting fig...');
    logger.info( botInfo.name, id, botInfo.description, botInfo.avatar, { "name": botInfo.creatorName, "url": "https://www.figgs.ai/profile?id=" + botInfo.creatorId }, comment, poster, tags);
    
    await postFig(channel, botInfo.name, id, botInfo.description, botInfo.avatar, { "name": botInfo.creatorName, "url": "https://www.figgs.ai/profile?id=" + botInfo.creatorId }, comment, poster, tags);
    logger.info('Fig posted successfully.');
}

module.exports = {
    postFig: postFig,
    postFigByLink: postFigByLink
};