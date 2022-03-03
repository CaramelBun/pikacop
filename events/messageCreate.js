const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const config = require('../config');
const db = require('quick.db');
const components = require('../components');

module.exports = async (client, message) => {

    //========== Mantainance Section ==========
    const mantainance = false
    const mantainancemessage = ""
    const mantainanceimmune = config.dev
    //========== Mantainance Section End ==========

    const user = message.author

    let perms = [
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'EMBED_LINKS',
        'READ_MESSAGE_HISTORY',
        'ADD_REACTIONS',
        'MANAGE_NICKNAMES'
    ]

    if (!message.guild) {
        console.log("Message was via DM")
    } else if (!message.guild.me.permissions.has(perms)) {
        console.log("Bot Missing Permissions")
    } else if (message.author.bot) {
        return;
    } else { 
        const db = require("quick.db");

        if (!message.guild || message.author.bot) {
            return;
        } 
        
        if (db.has(`${message.guild.id}.ar.${message.content.toLowerCase()}`)) {
            message.channel.send(db.get(`${message.guild.id}.ar.${message.content.toLowerCase()}.reaction`))
        }
    
        if (db.has(`${message.guild.id}.prefix`) == false) {
            db.set(`${message.guild.id}.prefix`, client.config.prefix)
        }

        client.prefix = db.get(`${message.guild.id}.prefix`)
        

        if (!message.content.toLowerCase().startsWith(client.prefix) && !message.mentions.has(client.user.id)) {
            return;
        } else {
            if (!message.channel.permissionsFor(client.user).has(perms)) {
                console.log("Missing Permissions to execute commands in "+message.channel+"")
            } else {
                function settings() {
                    let args
                    if (message.mentions.has(client.user.id)) {
                        if (message.content.includes(`<@!${client.user.id}>`)) {
                            args = message.content.replace(`<@!${client.user.id}>`, `${client.prefix}`).slice(client.prefix.length).trim().split(" ")
                        } else {
                            args = message.content.replace(`<@${client.user.id}>`, `${client.prefix}`).slice(client.prefix.length).trim().split(" ")
                        }
                    } else {
                        args = message.content.slice(client.prefix.length).trim().split(" ")
                    }

                    if (db.get(`${message.author.id}.cd.commands`) - Date.now() > 0) { //Prevent Bot from getting rate limited
                        return;
                    } else if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) { //Checking if message is just a bot mention (if yes, prefix message will pop up)
                        return message.reply("Aiyo did you forget my prefix?! <:hmph:924307894294433822> Since you forgot what it is, allow me to remind you that my prefix is `"+ db.get(`${message.guild.id}.prefix`) +"` so don't you forget that again :v If that's too hard to remember, you can always **ping me** as your prefix <:flustered:924308705409925150>");
                    }

                    let commandName = args.shift().toLowerCase();
                    let command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

                    if (!command) {
                        return;
                    }

                    db.set(`${message.author.id}.cd.commands`, Date.now() + 750)
                    command.execute(client, message, args)
                }

                if (!message.author.id.includes(mantainanceimmune)) {
                    if (mantainance == true) {
                        if (mantainancemessage == '') {
                            mantainancemessage = 'Currently Under Mantainance'
                        }
                        return message.reply(mantainancemessage)
                    } else {
                        settings()
                    }
                } else {
                    settings()
                }
            }
        }
    }
};
