const Discord = require('discord.js');
const bdd_gif = require("../bdd/allset.json");

function hasard(min, max){
    return min+Math.floor(Math.random()*(max-min+1));
}

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    let maxtab = (bdd_gif["database"]["beni"].length)-1;
    message.delete();
    message.channel.send(`${bdd_gif["database"]["beni"][hasard(0,maxtab)]}`);
}

module.exports.config = {
    name: "beni"
}
