const { cmdRun } = require('../funcs/cmdRun.js')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { connectDb } = require('../utils/mongo.js')
const { client } = require('../index.js')

const db = connectDb()

exports.helpCmd = async function helpCmd(user,guild,interaction) {
    const cmdName = 'help'

    let embed = new EmbedBuilder()
    .setTitle('Iono Help')
    .setDescription('Here are all the commands you can use')
    .setColor('Gold')
    .setFields([
        {
            name: '</battle:1073093299906289695>',
            value: 'Start a battle with another user',
            inline: false
        },
        {
            name: '</raid invite:1075994181014654976>',
            value: 'Start a raid with other users',
            inline: false
        },
        {
            name: '</help:1076002543655719002>',
            value: 'Shows this message',
            inline: false
        }

    ])

    interaction.reply({
        embeds: [embed],
    })
}