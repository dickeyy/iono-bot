const { ApplicationCommandOptionType } = require('discord.js');

// Permission integers
const BAN_MEMBERS_PERM = 0x0000000000000004
const KICK_MEMBERS_PERM = 0x0000000000000002
const ADMIN_PERM = 0x0000000000000008
const MODERATE_PERM = 0x0000010000000000

// structure commands
const commands = [

    {
        name: 'help',
        description: 'Get help with commands',
    },

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
    },

    // {
    //     name: 'raid',
    //     description: 'All the tera raid commands',
    //     options: [
    //         {
    //             name: 'invite',
    //             description: 'Invite users to a raid',
    //             type: ApplicationCommandOptionType.Subcommand,
    //             options: [
    //                 {
    //                     name: 'room_code',
    //                     description: 'The room code for the raid',
    //                     type: ApplicationCommandOptionType.String,
    //                     required: true,
    //                 },
    //                 {
    //                     name: 'opponent1',
    //                     description: 'Who you would like to invite',
    //                     type: ApplicationCommandOptionType.User,
    //                     required: true,
    //                 },
    //                 {
    //                     name: 'opponent2',
    //                     description: 'Who you would like to invite',
    //                     type: ApplicationCommandOptionType.User,
    //                     required: false,
    //                 },
    //                 {
    //                     name: 'opponent3',
    //                     description: 'Who you would like to invite',
    //                     type: ApplicationCommandOptionType.User,
    //                     required: false,
    //                 },
    //             ]
    //         }
    //     ]
    // }

]

// Export commands 
exports.commands = commands