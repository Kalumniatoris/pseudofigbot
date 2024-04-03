const { Events } = require('discord.js');
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
	name: Events.ClientReady,
	once: true,
	execute(client) {
		logger.info(`Ready! Logged in as ${client.user.tag}`);
		logger.info(`logged with id ${client.user.id}`);
	},
};