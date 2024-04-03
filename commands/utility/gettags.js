const { SlashCommandBuilder, ChannelType, Collection } = require('discord.js');
const { sfwTags, nsfwTags } = require("../../modules/tags.js");


const pino = require('pino');
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})


module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('gettags')
        .setDescription('get tags available for forum')
        .addChannelOption(option =>
            option.setName('sfwchannel')
                .setDescription('SFW Channel')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildForum))
        .addChannelOption(option =>
            option.setName('nsfwchannel')
                .setDescription('NSFW Channel')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildForum)
                )
        .addStringOption(option =>
            option.setName('update')
                .setDescription('Select an option')
                .addChoices(
                    { name: 'Update tags', value: 'update' },
                    { name: 'See tags from specific channel', value: 'see' })
        )




    ,
    async execute(interaction) {
        const sfwchannel = interaction.options.getChannel('sfwchannel');
        const nsfwchannel = interaction.options.getChannel('nsfwchannel');
   
            let tags_on_sfwchannel = sfwchannel.availableTags.map(s => ({ name: s.name, id: s.id }));
            let tags_on_nsfwchannel = nsfwchannel.availableTags.map(s => ({ name: s.name, id: s.id }));
           
            if (interaction.options.getString('update') === 'update') {
                sfwTags.clear();
                nsfwTags.clear();
                logger.info(`Updating tags for ${sfwchannel.name}:`);
                logger.info("adding tags")
                for (let tag of tags_on_sfwchannel) {
                    sfwTags.set(tag.name, tag.id)
                    logger.info(`added: ${tag.name} : ${tag.id} to sfwTags`);

                }
                for (let tag of tags_on_nsfwchannel) {
                    nsfwTags.set(tag.name, tag.id)
                    logger.info(`added: ${tag.name} : ${tag.id} to nsfwTags`);
                }

               require("../utility/postfig.js").update(sfwTags, nsfwTags);
 
            }
            else {
                //NOTHING HERE FOR NOW BUT KEEP EMPTY ELSE IN CASE               
            }
            await interaction.reply(`
                Tags for ${sfwchannel.name}:\n
                    ${tags_on_nsfwchannel.map(tag => `${tag.id} : ${tag.name}`).join('\n')} \n
                Tags for ${nsfwchannel.name}:\n
                    ${tags_on_nsfwchannel.map(tag => `${tag.id} : ${tag.name}`).join('\n')}
                    `)

                .then(() => logger.info(`Posted tags for ${sfwchannel.name} and ${nsfwchannel.name}`))
            // .then(() => logger.info(tagcol));


        
       // } else {
      //      await interaction.reply('Please provide a valid forum channel.');
      //  }

    },


};