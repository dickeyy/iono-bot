// import the command functions
const battleCmd = require('./cmds/battle.js').battleCmd
const raidInviteCmd = require('./cmds/raid/raidInvite.js').raidInviteCmd
const helpCmd = require('./cmds/help.js').helpCmd

// Recive slash commands
exports.commandHandler = async (interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName, options, user, guild, channel, ChannelData } = interaction

    if (commandName == 'help') {
        helpCmd(user,guild,interaction)
    }

    if (commandName == 'battle') {
        const opponent = options.getUser('opponent')
        const room = options.getString('room')
        battleCmd(user,guild,interaction,opponent,room)
    }

    if (commandName == 'raid') {
        const subCommand = options.getSubcommand()
        if (subCommand == 'invite') {
            const opponent1 = options.getUser('opponent1')
            const opponent2 = options.getUser('opponent2')
            const opponent3 = options.getUser('opponent3')
            const room = options.getString('room_code')

            const opponentsList = []

            if (opponent1) opponentsList.push(opponent1)
            if (opponent2) opponentsList.push(opponent2)
            if (opponent3) opponentsList.push(opponent3)

            raidInviteCmd(user,guild,interaction,opponentsList,room)
        }
    }

}