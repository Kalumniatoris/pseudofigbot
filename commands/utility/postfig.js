const { SlashCommandBuilder, Routes, REST } = require('discord.js');
const { sfwThread, nsfwThread, token, clientId, guildId, postfigID } = require('../../config.json');
const { postFigByLink } = require('../../modules/forumfig.js');

const { sfwTags } = require('../../modules/tags.js');

const { nsfwTags } = require('../../modules/tags.js');

const rest = new REST().setToken(token);



const pino = require('pino');
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})
//var tagsMap;

logger.info("VVVVVV");
logger.info(sfwTags);
logger.info("^^^^^^^^^^^")

var tmp = [
    ["These", "q210884801792315442"],
    ["Tags", "q210884813481967656"],
    ["Are", "q210884829890220072"],
    ["Invalid", "qnope"],
    ["SetCorrectOnes", "q22222222222222222"]
];
var tmp2 = [
    ["These", "q210884801792315442"],
    ["Tags", "q210884813481967656"],
    ["Are", "q210884829890220072"],
    ["Invalid", "qnope"],
    ["SetCorrectOnes", "q22222222222222222"]
];

if (sfwTags && sfwTags.size == 0) {
    //logger.info("AAHAHAHAHAHAHAHHAHHAHAH")
    //  logger.info('sfwTags:', sfwTags);
    for (tag of tmp) {
        //   logger.info('tag:', tag);
        sfwTags.set(tag[0], tag[1]);
    }
    for (tag of tmp2) {
        //   logger.info('tag:', tag);
        nsfwTags.set(tag[0], tag[1]);
    }
} else if (sfwTags) {
    logger.info("detected existing tags, not adding temporary ones")
   
}
// tagsMap=sfwTags;


function createCommandData(tags_for_sfw, tags_for_nsfw) {
    logger.info("--createCommandData--")
    logger.info(tags_for_sfw, tags_for_nsfw);
    try {
        const commandData = new SlashCommandBuilder()
            .setName('postfig')
            .setDescription('Posts fig to forum')

            .addSubcommand(subcommand =>
                subcommand.setName("sfw")
                    .setDescription("sfw figgs")
                    .addStringOption(option =>
                        option.setName('link')
                            .setDescription('Link or ID of public fig')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('comment')
                            .setDescription('Comment on fig')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('tag1')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_sfw.entries()].map(([name, value]) => ({ name, value }))

                            )
                            .setRequired(true)

                    ).addStringOption(option =>
                        option.setName('tag2')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_sfw.entries()].map(([name, value]) => ({ name, value }))


                            )
                            .setRequired(false)

                    ).addStringOption(option =>
                        option.setName('tag3')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_sfw.entries()].map(([name, value]) => ({ name, value }))


                            )
                            .setRequired(false)

                    ).addStringOption(option =>
                        option.setName('tag4')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_sfw.entries()].map(([name, value]) => ({ name, value }))


                            )
                            .setRequired(false)

                    ).addStringOption(option =>
                        option.setName('tag5')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_sfw.entries()].map(([name, value]) => ({ name, value }))


                            )
                            .setRequired(false)

                    )
            )
            .addSubcommand(subcommand =>
                subcommand.setName("nsfw")
                    .setDescription("nsfw figgs")
                    .addStringOption(option =>
                        option.setName('link')
                            .setDescription('Link or ID of public fig')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('comment')
                            .setDescription('Comment on fig')
                            .setRequired(true))
                    .addStringOption(option =>
                        option.setName('tag1')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_nsfw.entries()].map(([name, value]) => ({ name, value }))

                            )
                            .setRequired(true)

                    ).addStringOption(option =>
                        option.setName('tag2')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_nsfw.entries()].map(([name, value]) => ({ name, value }))


                            )
                            .setRequired(false)

                    ).addStringOption(option =>
                        option.setName('tag3')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_nsfw.entries()].map(([name, value]) => ({ name, value }))


                            )
                            .setRequired(false)

                    ).addStringOption(option =>
                        option.setName('tag4')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_nsfw.entries()].map(([name, value]) => ({ name, value }))


                            )
                            .setRequired(false)

                    ).addStringOption(option =>
                        option.setName('tag5')
                            .setDescription('Tags')
                            .addChoices(
                                ...[...tags_for_nsfw.entries()].map(([name, value]) => ({ name, value }))


                            )
                            .setRequired(false)

                    )
            )




        return commandData;
    } catch (error) {
        logger.error(error);
    }
}

module.exports = {
    //// HERE
    cooldown: 15,
    data: createCommandData(sfwTags, nsfwTags),





    async execute(interaction) {

        channels = {
            sfwChannel: interaction.client.channels.cache.get(sfwThread),

            nsfwChannel: interaction.client.channels.cache.get(nsfwThread)
        }
        let mode = interaction.options.getSubcommand();
        logger.info(`subcommand: ${mode}`);
        if (mode == "sfw") {
            sfw = true;
        } else if (mode == "nsfw") {
            sfw = false;
        }
        else {
            console.error("unknown mode: " + mode);
            interaction.reply("ERROR: unknown mode: " + mode);
            return;
        }

        //return;
        await interaction.reply({ content: `Posting figg ${interaction.options.getString('link')} to forum with comment: ${interaction.options.getString('comment')} channels: ${channels}`, ephemeral: true });
        let gt = function (x) { return interaction.options.getString(x) }
        let tagi = [gt('tag1'), gt('tag2'), gt('tag3'), gt('tag4'), gt('tag5')];
        logger.info(`tagi: ${tagi}`);
        let nonEmptyTagi = tagi.filter(tag => typeof tag === 'string' && tag !== '');
        logger.info(`non empty tags: ${nonEmptyTagi}`);
        if (true) {
            await postFigByLink(
                link = interaction.options.getString('link'),
                comment = interaction.options.getString('comment'),
                sfw = sfw,
                channels = channels,
                poster = interaction.user,
                tags = nonEmptyTagi
            );
        }

        await interaction.followUp({ content: `Posted figg ${interaction.options.getString('link')} to forum with comment: ${interaction.options.getString('comment')} channels: ${channels}`, ephemeral: true });
        //await interaction.reply('posting figg')
    },
    async update(tags_for_sfw, tags_for_nsfw) {

        logger.info("updating tags for postfig command");

        try {
            //const rest = new REST().setToken(token);

            data = createCommandData(tags_for_sfw, tags_for_nsfw);

            logger.info(data);



            await rest.patch(
                Routes.applicationGuildCommand(clientId, guildId, postfigID),
                { body: data }

            ).then(() => logger.info("Updated tags for postfig command"))
        } catch (error) {

        }



    }


};


