const { Client, GatewayIntentBits  } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildScheduledEvents ] });
const { REST } = require('@discordjs/rest');
const { Routes, InteractionResponseType } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const { log } = require('./funcs/log');

// Process errors
process.on('uncaughtException', async function (error) {
    console.log('error', error.stack)
    log('error', error.stack)
});

// Export Client
module.exports = { client };

// init dotenv
dotenv.config();

// Import commands
const commands = require('./commands').commands
const commandHandler = require('./commandHandler').commandHandler

// // Import events
const guildDeleteEvent = require('./events/guildDelete').guildDeleteEvent
const guildCreateEvent = require('./events/guildCreate').guildCreateEvent

// Register slash commands
var rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {

        console.log('Started refreshing application (/) commands.');

        await rest.put(

            Routes.applicationCommands(process.env.DISCORD_APP_ID),
            {body: commands},

        );

        console.log('Successfully reloaded application (/) commands.');

    } catch (error) {

        console.error(error);

    }
})();

// Client Events
// Recive slash commands
client.on('interactionCreate', async interaction => {
    commandHandler(interaction)
})

// on login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// on guild leave
client.on('guildDelete', async guild => {
    guildDeleteEvent(guild)
})

// on guild join
client.on('guildCreate', async guild => {
    guildCreateEvent(guild)
})

// Run bot
client.login(process.env.DISCORD_TOKEN)