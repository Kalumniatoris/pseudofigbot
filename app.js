// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, version, ForumChannel} = require('discord.js');
const { token,sfwThread,nsfwThread,clientId,guildId } = require('./config.json');
const { postFigByLink } = require('./modules/forumfig.js');
const {nsfwTags, sfwTags} = require('./modules/tags.js');

const pino= require('pino');
const logger = pino({
	transport: {
	  target: 'pino-pretty',
	  options: {
		colorize: true
	  }
	}
  })
//console.log=logger.info

//require('./modules/tags.js').initialize();
const forumfig = require('./modules/forumfig.js');
const gc = require('./modules/getFig.js');
require('./modules/getFig.js');

logger.info(`Using discord.js version: ${version}`);

const fs = require('node:fs');
const path = require('node:path');
const getFig = require('./modules/getFig.js');
// Create a new client instance



const client = new Client({ intents: [GatewayIntentBits.Guilds] });


//commands handling
/*client.commands = new Collection();




//logger.info("Loading commands...",client.commands);

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		logger.info(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
*/




client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	logger.info(`Processing folder: ${folder}`); // Debugging statement
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		logger.info(`Processing file: ${file}`); // Debugging statement
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			logger.info(`Command '${command.data.name}' loaded successfully`); // Debugging statement
		} else {
			logger.info(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.cooldowns = new Collection();

//require('./deploy_commands.js');


//logger.info("Commands loaded...",client.commands);

//require("./deploy_commands.js")
///end of commands
/// events handling



const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('threadCreate', async (thread) => {
	if (!(thread.parent instanceof ForumChannel)) {
	   logger.info("Not a forum channel");
	}
	logger.info("tags:", thread.appliedTags.map(s => thread.parent.availableTags.find(t => t.id === s)).map(x => (x.id+": "+x.name+" "+x)).join(","));
 });


client.on('guildCreate', guild => {
	// Send introduction message to the default channel of the guild
	logger.info("gme: " + guild.client.user);
	const defaultChannel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.client.user).has('SEND_MESSAGES'));
	logger.info("joined " + guild.name);
	guild.channels.cache.forEach((channel) => {
		const permissions = channel.permissionsFor(client.user);
		if (permissions) {
			//	logger.info(`Permissions for ${channel.name} - ${channel.type}: ${permissions.bitfield}`);
		} else {
			logger.info(`${channel.name} - ${channel.type} Permissions not available`);
		}
	});
	logger.info("def: " + defaultChannel);
	if (defaultChannel) {
		defaultChannel.send('PseudoFigBot is online!');
	}

	require('./deploy_commands.js');



});

// Log in to Discord with your client's token
client.login(token);
