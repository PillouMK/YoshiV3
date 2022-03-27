// require Librairies
const Discord   = require('discord.js');
const fs        = require('fs');

// require BDD
const bdd_times    = require("../bdd/timetrial2.json");
const settings     = require("../bdd/settings.json");

// require classes
const Fonctions     = require('../fonctions');
const fct           = new Fonctions();



module.exports.run = async (bot, message, args) =>
{
    if(message.author.id === settings.idAdmin)
    {
        let res = "```\nINSERT INTO `Map`(`id`, `name-map`, `minia`, `bag`, `initial-game`, `DLC`, `retro`)\n   VALUES";
        bdd_times.forEach(element => {
            res += "('  "+element.id+"','"+element.infos['name-map']+"','"+element.infos.minia+"','"+element.infos.bag+"','"+element.infos['initial-game']+"',"+element.infos.DLC+","+element.infos.retro+"),\n";
            if(res.length > 1500){
                res += "```";
                message.channel.send(res);
                res = "```\nINSERT INTO `Map`(`id`, `name-map`, `minia`, `bag`, `initial-game`, `DLC`, `retro`)\n   VALUES";
            }
        })
        message.channel.send(res+"```");
    } else {
        message.reply("Tu n'as pas la permission");
    }
    

}

module.exports.config = {
    name: "sqlMap"
}