const { MessageEmbed, Permissions} = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const db = require('quick.db');
const components = require('../components');
const config = require('../config');
const error = require('../error');
exports.execute = async (client, message, args) => {

    const user = message.author
    let arlimit = 50
    if (!message.member.permissions.has('MANAGE_GUILD')) {
        return;
    } else if (!args[0]) {
        return message.reply(`You can get the full guide on using auto reactions by running ${'`' + db.get(`${message.guild.id}.prefix`) + 'help autoreaction`!'}`)
    } else if (db.get(`${user.id}.cd.ar`) - Date.now() > 0) {
        return message.reply('Ayo you recently used this command... Wait for `' + prettyMilliseconds(db.get(`${user.id}.cd.ar`) - Date.now()) + '` before using the command again.').then(msg => {
            setTimeout(() => {
                msg.delete().catch(err => {
                    console.log("Message cannot be deleted as it no longer exists" + '\n\nError:\n' + err)
                });
            }, 7500)
        })
    } else if (args[0].toLowerCase() == 'view' || args[0].toLowerCase() == 'list') {
        try {
            db.set(`${user.id}.cd.ar`, Date.now() + 10000)
        } catch (err) {
            console.log(err)
        }
        try {
            let desc = ''

            if (!db.has(`${message.guild.id}.arlist`)) {
                return message.reply("There doesn't seem to be any auto reactions in this server :c");
            }

            for (let i = 0; i < db.get(`${message.guild.id}.arlist`).length; i++) {
                if (i == db.get(`${message.guild.id}.arlist`).length - 1) {
                    desc = desc + '`' + db.get(`${message.guild.id}.arlist`)[i] + '`' + ''
                } else {
                    desc = desc + '`' + db.get(`${message.guild.id}.arlist`)[i] + '`' + ',\n'
                }
            }

            if (desc.length > 2000) {
                return message.reply('Auto reaction total length exceeds `2000` characters!');
            } else if (desc.length < 1) {
                return message.reply("There doesn't seem to be any auto reactions in this server :c")
            }

            let embed = new MessageEmbed()
            .setTitle(`${message.guild.name}'s auto reactions!`)
            .setDescription(desc)
            .setFooter(`${message.guild.name} has a total of ${db.get(`${message.guild.id}.arlist`).length} auto reactions`)
            .setColor('#2e3036')

            return message.reply({
                embeds: [embed]
            })
        } catch (err) {
            error(message, err, 'AUTOREACTION_VIEW_ERR')
        }
    } else if (args[0].toLowerCase() == 'add' || args[0].toLowerCase() == '+') {
        try {
            if (db.has(`${message.guild.id}.arlist`) && db.get(`${message.guild.id}.arlist`).length > arlimit) {
                return message.reply(`**${message.guild.name}** has hit it's limit of ${'`' + 50 + '`'} auto reaction! Please delete a previous auto reaction before adding another.`)
            } else if(!args.join(' ').split('add')[1] && !args.join(' ').split('+')[1]) {
                let errembed = new MessageEmbed()
                .setTitle('Missing required arguments!')
                .setDescription("```\n"+ db.get(`${message.guild.id}.prefix`) +"autoreaction add <trigger> || <reaction>\n                   ^^^^^^^^^ ^^ ^^^^^^^^^^\n```\n\n`<>` are required arguments\n`[]` are optional arguments\n`||` is a required object to seperate the trigger with the reaction")
                .setFooter(`You can get the full guide on using auto reactions by running ${'`' + db.get(`${message.guild.id}.prefix`) + 'help autoreaction`!'}`)
                .setColor('#2e3036')
                
                return message.reply({
                    embeds: [errembed]
                })
            } else if (!args.join(' ').includes('||')) {

                let errembed = new MessageEmbed()
                .setTitle('Missing required arguments!')
                .setDescription("```\n"+ db.get(`${message.guild.id}.prefix`)+"autoreaction add <trigger> || <reaction>\n                             ^^ \n```\n\n`<>` are required arguments\n`[]` are optional arguments\n`||` is a required object to seperate the trigger with the reaction")
                .setFooter(`You can get the full guide on using auto reactions by running ${'`' + db.get(`${message.guild.id}.prefix`) + 'help autoreaction`!'}`)
                .setColor('#2e3036')
    
                return message.reply({
                    embeds: [errembed]
                })
            } else if (!args.join(' ').split('||')[1]) {
    
                let errembed = new MessageEmbed()
                .setTitle('Missing required arguments!')
                .setDescription("```\n"+ db.get(`${message.guild.id}.prefix`)+"autoreaction add <trigger> || <reaction>\n                                ^^^^^^^^^^\n```\n\n`<>` are required arguments\n`[]` are optional arguments\n`||` is a required object to seperate the trigger with the reaction")
                .setFooter(`You can get the full guide on using auto reactions by running ${'`' + db.get(`${message.guild.id}.prefix`) + 'help autoreaction`!'}`)
                .setColor('#2e3036')
                
                return message.reply({
                    embeds: [errembed]
                })
            } else {
                let base = args.splice(1).join(' ')
                let trigger = base.split('||')[0].split(' ')

                while (trigger.join(' ').endsWith(' ')) {
                    trigger.pop();
                }

                trigger = trigger.join(' ');

                let reaction = base.split('||')[1].split(' ')

                while (reaction.join(' ').startsWith(' ')) {
                    reaction.shift();
                }

                reaction = reaction.join(' ');

                if (reaction.length >= 1 && reaction.length <= 1048 && trigger.length <= 100) {
                    if (!db.has(`${message.guild.id}.ar.${trigger.toLowerCase()}`)) {
                        db.set(`${message.guild.id}.ar.${trigger.toLowerCase()}.reaction`, `${reaction}`)
                        db.push(`${message.guild.id}.arlist`, `${trigger.toLowerCase()}`)
                        
                        db.set(`${user.id}.cd.ar`, Date.now() + 20000)

                        return message.reply(`<:pctick:941198894753271858> Successfully added ${'`' + trigger + '`'} as an auto reaction!`)
                    } else if (db.has(`${message.guild.id}.ar.${trigger.toLowerCase()}`)) {
                        db.set(`${message.guild.id}.ar.${trigger.toLowerCase()}.reaction`, `${reaction}`)
                        db.set(`${user.id}.cd.ar`, Date.now() + 20000)

                        return message.reply(`<:pctick:941198894753271858> Successfully updated the ${'`' + trigger + '`'} auto reaction!`)
                    } 
                } else {
                    if (reaction.length > 1048) {
                        return message.reply('Reaction length cannot exceed `1,048` characters!')
                    } else if (reaction.length < 1) {
                        return message.reply('Reaction length cannot be less than `1` character!')
                    } else if (trigger.length > 100) {
                        return message.reply('Trigger length cannot exceed `100` characters!')
                    } else {
                        error(message, err, 'AUTOREACTION_INVALID_RTLENGTH_ERR')
                    }
                }
            }
        } catch (err) {
            error(message, err, 'AUTOREACTION_ADD_ERR')
        }
    } else if (args[0].toLowerCase() == 'remove' || args[0].toLowerCase() == '-' || args[0].toLowerCase() == 'delete') {
        try {
            let target = args.splice(1).join(' ')

            if (!db.has(`${message.guild.id}.ar.${target.toLowerCase()}`)) {
                return message.reply('<:pccross:941198640595214337> `'+ target + '` is not a valid auto reaction!')
            } else {
                db.delete(`${message.guild.id}.ar.${target.toLowerCase()}`)

                let ogarr = db.get(`${message.guild.id}.arlist`)

                ogarr.splice(db.get(`${message.guild.id}.arlist`).indexOf(target.toLowerCase()), 1)

                db.set(`${message.guild.id}.arlist`, ogarr)
                db.set(`${user.id}.cd.ar`, Date.now() + 15000)

                return message.reply('<:pctick:941198894753271858> Successfully deleted `'+ target + '` auto reaction!')
            }
        } catch (err) {
            error(message, err, 'AUTOREACTION_DELETE_ERR')
        }
    } else {
        return message.reply(`You can get the full guide on using auto reactions by running ${'`' + db.get(`${message.guild.id}.prefix`) + 'help autoreaction`!'}`)
    }
}

exports.help = {
    name: "autoreaction",
    aliases: ["ar", "react", "autor", "autoreact"],
    usage: `autoreact <action> <reaction> || <response>`
}