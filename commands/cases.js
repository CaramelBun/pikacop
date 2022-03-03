const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const db = require('quick.db');
const components = require('../components');
const error = require('../error');
const convertMs = require('../convertMs');
exports.execute = async (client, message, args) => {
    const user = message.author
    
}

exports.help = {
    name: "cases",
    aliases: ['case'],
    usage: `cases`
}