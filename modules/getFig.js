const axios = require('axios');
const pino= require('pino');
const logger = pino({
	transport: {
	  target: 'pino-pretty',
	  options: {
		colorize: true
	  }
	}
  })
  
module.exports = {
async getBotInfoById(id) {
  try {
    const url = `https://api.figgs.ai/bots?id=${id}`;
    logger.info(`Fetching bot info from: ${url}`);
    const response = await axios.get(url);
    const { name, description, creatorId, creatorName, avatar } = await response.data.items[0];
    logger.info('Bot info:', { name, description, creatorId, creatorName, avatar });
  //  console.debug('Response data:', response.data);
  //  console.debug('Bot info:', { name, description, creator_id, creator_name, avatar });

    return { name, description, creatorId, creatorName, avatar };
  } catch (error) {
    logger.error("ERROERRRORERROR")
    logger.error(error);
    logger.error("ERROERRRORERROR")
    return null;
  }
}
};