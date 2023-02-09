const { cmdRun } = require('../funcs/cmdRun.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { connectDb } = require('../utils/mongo.js')
const { client } = require('../index.js')

const db = connectDb()

// Set up cooldown stuff
const cooldown = new Set();
const oneMinCooldown = 60000;

const cdList = ['Chill Out', 'CHILLLLL', 'Stop.', 'Take a Breather', 'ok', 'Spamming commands is cringe', 'Slow it down', 'Wee-Woo-Wee-Woo Pull Over', 'No smile', '-_-', 'Why tho...', 'Yikes U Should Like Not', 'Slow it Cowboy', 'Take a Break Bro', 'Go Touch Some Grass']

exports.battleCmd = async function battleCmd(user,guild,interaction,opponent,room) {

    const cmdName = 'battle'

    if (cooldown.has(`${user.id}--${cmdName}`)) {

        let embed = new EmbedBuilder()
        .setTitle(cdList[Math.floor(Math.random() * cdList.length)])
        .setDescription('That command can only be run once every 1 minute')
        .setColor('Red')

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }

    // if the room number is longer than 6 digits
    if (room.length > 6) return interaction.reply({ content: 'The room number must be 6 digits or less', ephemeral: true }, true)

    let embed = new EmbedBuilder()
    .setTitle(`You have been challenged by ${user.username}!`)
    .setFooter({ text: 'You have 2 minutes to respond' })
    .setTimestamp()
    .setColor("Gold")

    let comps = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('accept-' + user.id + '-' + opponent.id + '-' + room)  
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('decline-' + user.id + '-' + opponent.id + '-' + room)
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger)
    )

    interaction.reply({
        content: `<@${opponent.id}>`,
        embeds: [embed],
        components: [comps]
    })

    const filter = i => i.customId === `accept-${user.id}-${opponent.id}-${room}` || i.customId === `decline-${user.id}-${opponent.id}-${room}` && i.user.id === opponent.id
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 })

    collector.on('collect', async i => {

        if (i.user.id !== opponent.id) return i.reply({ content: 'You are not the opponent!', ephemeral: true }, true)

        let buttonId = i.customId

        if (buttonId == `accept-${user.id}-${opponent.id}-${room}`) {

            let embed = new EmbedBuilder()
            .setTitle(`Battle Accepted!`)
            .setDescription('**' + user.username + '** vs **' + opponent.username + '**')
            .setTimestamp()
            .setColor("Purple")
        
            i.update({
                embeds: [embed],
                components: [],
                content: null
            })
            
            let embed2 = new EmbedBuilder()
            .setTitle(`Battle Accepted!`)
            .setDescription('Room Code: \`' + room + '\`')
            .setTimestamp()
            
            client.users.send(opponent.id, {
                embeds: [embed2],
            })

        } else if (buttonId == `decline-${user.id}-${opponent.id}-${room}`) {

            let embed = new EmbedBuilder()
            .setTitle(`Battle Declined!`)
            .setDescription('**' + user.username + '** vs **' + opponent.username + '**')
            .setTimestamp()
            .setColor("Red")

            i.update({
                content: null,
                embeds: [embed],
                components: []
            })

        }
    })

    collector.on('end', collected => {
        if (collected.size == 0) {
            let embed = new EmbedBuilder()
            .setTitle(`Battle Timed Out!`)
            .setDescription('**' + user.username + '** vs **' + opponent.username + '**')
            .setTimestamp()
            .setColor("Grey")

            interaction.editReply({
                content: null,
                embeds: [embed],
                components: []
            })
        }
    })

    cooldown.add(`${user.id}--${cmdName}`);
    setTimeout(() => {
        cooldown.delete(`${user.id}--${cmdName}`);
    }, oneMinCooldown);


    cmdRun(user,guild,interaction,cmdName)

}