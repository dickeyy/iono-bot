const { cmdRun } = require('../../funcs/cmdRun.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { connectDb } = require('../../utils/mongo.js')
const { client } = require('../../index.js')

const db = connectDb()

// Set up cooldown stuff
const cooldown = new Set();
const oneMinCooldown = 60000;

const cdList = ['Chill Out', 'CHILLLLL', 'Stop.', 'Take a Breather', 'ok', 'Spamming commands is cringe', 'Slow it down', 'Wee-Woo-Wee-Woo Pull Over', 'No smile', '-_-', 'Why tho...', 'Yikes U Should Like Not', 'Slow it Cowboy', 'Take a Break Bro', 'Go Touch Some Grass']

exports.raidInviteCmd = async function raidInviteCmd(user,guild,interaction,opponents,room) {

    const cmdName = 'raid-invite'

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

    // if the room number is longer than 12 digits
    if (room.length > 12) return interaction.reply({ content: 'The room number must be 12 digits or less', ephemeral: true }, true)

    let titleString = ''
    let mentionString = ''

    for (let i = 0; i < opponents.length; i++) {
        titleString += `${opponents[i].username}`
        if (i < opponents.length - 1) titleString += ', '
        mentionString += `<@${opponents[i].id}> `
    }

    const embed = new EmbedBuilder()
    .setTitle(`${titleString} have been invited to a tera raid by ${user.username}!`)
    .setDescription('No one has accepted yet...')
    .setFooter({ text: 'You have 3 minutes to respond' })
    .setTimestamp()
    .setColor("Gold")

    let comps = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('accept-' + user.id + '-' + opponents[0].id + '-' + room)  
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('decline-' + user.id + '-' + opponents[0].id + '-' + room)
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger)
    )

    interaction.reply({
        content: mentionString,
        embeds: [embed],
        components: [comps]
    })

    // keep track of who has accepted
    let accepted = []

    const filter = i => i.customId === `accept-${user.id}-${opponents[0].id}-${room}` || i.customId === `decline-${user.id}-${opponents[0].id}-${room}`
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 180000 })

    collector.on('collect', async i => {

        if (i.customId === `accept-${user.id}-${opponents[0].id}-${room}`) {

            // if the user has already accepted
            if (accepted.includes(i.user.id)) return

            accepted.push(i.user.id)

            // if all users have accepted
            if (accepted.length === opponents.length) {

                // remove the buttons
                i.update({
                    components: []
                })

                // send the raid message
                const raidEmbed = new EmbedBuilder()
                .setTitle(`${titleString} have accepted ${user.username}'s raid invite!`)
                .setDescription(`Room: \`${room}\``)

                await i.followUp({
                    content: mentionString,
                    embeds: [raidEmbed]
                })


                // stop the collector
                collector.stop()

            } else {

                // update the embed
                const raidEmbed = new EmbedBuilder()
                .setTitle(`${titleString} have been invited to a tera raid by ${user.username}!`)
                .setDescription(`${accepted.length} of ${opponents.length} have accepted`)
                .setFooter({ text: 'You have 3 minutes to respond' })
                .setTimestamp()
                .setColor("Gold")

                i.update({
                    embeds: [raidEmbed]
                })

            }

        } else if (i.customId === `decline-${user.id}-${opponents[0].id}-${room}`) {

            // remove the buttons
            i.update({
                components: []
            })

            // send the raid message
            const raidEmbed = new EmbedBuilder()
            .setTitle(`${titleString} have declined ${user.username}'s raid invite!`)
            .setColor("Gold")

            interaction.channel.send({
                content: mentionString,
                embeds: [raidEmbed]
            })

            // stop the collector
            collector.stop()

        }

        
    })

    cooldown.add(`${user.id}--${cmdName}`);
    setTimeout(() => {
        cooldown.delete(`${user.id}--${cmdName}`);
    }, oneMinCooldown);

    cmdRun(user,cmdName,guild,interaction)

}