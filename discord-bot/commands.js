const { ApplicationCommandOptionType } = require('discord.js');

// Permission integers
const BAN_MEMBERS_PERM = 0x0000000000000004
const KICK_MEMBERS_PERM = 0x0000000000000002
const ADMIN_PERM = 0x0000000000000008
const MODERATE_PERM = 0x0000010000000000

// structure commands
const commands = [

    {
        name: 'battle',
        description: 'Challenge a user to a battle',
        options: [
            {
                name: 'opponent',
                description: 'Who you would like to challenge',
                type: ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'room',
                description: 'The room code for the battle',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    }

]

// Export commands 
exports.commands = commands