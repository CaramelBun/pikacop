const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const db = require('quick.db');
const components = require('../components');
const config = require('../config');
const error = require('../error');
exports.execute = async (client, message, args) => {

    const user = message.author

    if (!args[0]) {
        return message.reply(components.tips[Math.floor(Math.random() * components.tips.length)] + `My prefix for **${message.guild.name}** is ` + "`" +db.get(`${message.guild.id}.prefix`)+ "`!")
    } else {
        try {
            if (args[0].toLowerCase() == 'set' || args[0].toLowerCase() == 'edit') {
                if (!message.member.permissions.has('MANAGE_GUILD')) {
                    return message.reply("You need the `Manage Server` permissions to change the server's prefix!")
                } else if ((db.get(`${message.guild.id}.cd.prefix`) - Date.now()) > 0) {
                    return message.reply(`<:sippingboba:924506659907317820> Hmm... How many prefixes can one server have? **${message.guild.name}**'s prefix has recently been changed. Please wait for another ` + "`" + `${prettyMilliseconds(db.get(`${message.guild.id}.cd.prefix`) - Date.now())}` + "`" + ` before changing the server's prefix again!`).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(err => {
                                console.log("Message cannot be deleted as it no longer exists" + '\n\nError:\n' + err)
                            });
                        }, 7500)
                    });
                } else if (!args[1]) {
                    let embed = new MessageEmbed()
                    .setDescription("```\n"+ `${db.get(`${message.guild.id}.prefix`)}` +" prefix set <prefix>\n               ^^^^^^^^\n             missing <prefix>```")
                    .setFooter('<> Required Arguments || [] Optional Arguments')
    
                    return message.reply({
                        embeds: [embed]
                    })
                } else if (args[1].length > 10 || args[1].length < 1) {
                    return message.reply('Your prefix cannot be more than `10` or less than `1` characters!')
                } else if (args[1] == db.get(`${message.guild.id}.prefix`)) {
                    return message.reply('The current server prefix is already `' + args[1] + '`. Try changing the prefix to something other than `' + args[1] + '`!')
                } else {
    
                    db.set(`${message.guild.id}.cd.prefix`, (Date.now() + 60000))
    
                    let failembed = new MessageEmbed()
                    .setAuthor(`${user.username}#${user.discriminator}`, user.displayAvatarURL())
                    .setDescription(`<:pccross:941198640595214337> An error has occured! Prefix has not been changed because an internal error has occured, please report this error as soon as possible!`)
                    .setColor('RED')
                
                    try {
                        db.set(`${message.guild.id}.prefix`, args[1].toLowerCase())
    
                        let successembed = new MessageEmbed()
                        .setAuthor(`${user.username}#${user.discriminator}`, user.displayAvatarURL())
                        .setDescription(`<:pctick:941198894753271858> **${message.guild.name}**'s prefix has successfully been changed to ` + "`" + `${db.get(`${message.guild.id}.prefix`)}` + "`!")
                        .setColor('GREEN')
    
                        return message.reply({
                            embeds: [successembed],
                            content: `${components.tips[Math.floor(Math.random() * components.tips.length)]}`
                        })
                    } catch (err) {
                        console.log(err)
    
                        return message.reply({
                            embeds: [failembed]
                        })
                    }
                }
            } else {
                return message.reply(components.tips[Math.floor(Math.random() * components.tips.length)] + `My prefix for **${message.guild.name}** is ` + "`" +db.get(`${message.guild.id}.prefix`)+ "`!")
            }
        } catch (err) {    
            error(message, err, 'PREFIX_SET_ERR')
        }
    }
}

exports.help = {
    name: "prefix",
    aliases: ["prefix"],
    usage: `prefix set <prefix>`
}