const { client, consoleWebhookClient } = require('../index.js');
const { log } = require('./log.js');

const cmdRun = async (user,cmdName,guild,interaction) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    log('info',`${user.tag} - ${cmdName}`)

    console.log(`${date} ${time} | ${user.tag} - ${cmdName}`)

    consoleWebhookClient.send({
        avatarURL: client.user.displayAvatarURL(),
        username: 'Console',
        content: `\`\`\`${date} ${time} | ${user.tag} - ${cmdName}\`\`\``
    })
    
}

exports.cmdRun = cmdRun;