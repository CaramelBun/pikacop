const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const db = require('quick.db');
const components = require('../components');
const error = require('../error');
const convertMs = require('../convertMs');
exports.execute = async (client, message, args) => {
    const user = message.author

    try {
    
        if (db.get(`${user.id}.cd.uptime`) - Date.now() > 0) {
            return;
        } 
        
        db.set(`${user.id}.cd.uptime`, Date.now() + 5000)
        return message.reply(`<a:online:923826409359687710> **${client.user.tag}** has been online for ${convertMs(client.uptime, true)}!`)
    } catch (err) {
        error(message, err, 'UPTIME_ERR')
    }
}

exports.help = {
    name: "uptime",
    aliases: [],
    usage: `uptime`
}