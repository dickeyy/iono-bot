// import the command functions
const battleCmd = require('./cmds/battle.js').battleCmd

// Recive slash commands
exports.commandHandler = async (interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName, options, user, guild, channel, ChannelData } = interaction

    if (commandName == 'battle') {
        const opponent = options.getUser('opponent')
        const room = options.getString('room')
        battleCmd(user,guild,interaction,opponent,room)
    }

}