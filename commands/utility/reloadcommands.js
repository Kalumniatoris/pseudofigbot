const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('reloadcommands')
    .setDescription('Reloads all slash commands on the server.'),
  async execute(interaction) {
    try {
      await require("../../deploy_commands.js");
      interaction.reply({ content: 'Reloaded commands', ephemeral: true });

    } catch (error) {
      interaction.reply({ content: 'Failed to reload commands \n\n' + error, ephemeral: true });
    }


  },
};