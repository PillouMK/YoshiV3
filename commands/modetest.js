// require Librairies
const Discord = require('discord.js');
const fs = require('fs');

// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");
const settings          = require("../bdd/settings.json");

// require classes
const Fonctions     = require('../fonctions');
const fct           = new Fonctions();


module.exports.run = async (bot, message, args) =>
{
    // mode test (botwar)
    if(settings.idAdmin != message.author.id) { 
        message.reply("missing permissions");
        return;
    }

    if(args[1] == "ON") {
        console.log(settings.modeTest.hasOwnProperty(args[2]));
            if(settings.modeTest.hasOwnProperty(args[2])){
                settings.modeTest[args[2]] = true;
                fct.savebdd("./bdd/settings.json", settings);
                message.channel.send(" mode test activé pour "+args[2]);
            }
            else message.reply("Error : "+args[2]+" not found");

    }
    else if(args[1] == "OFF") {
            if(settings.modeTest.hasOwnProperty(args[2])){
                settings.modeTest[args[2]] = false;
                fct.savebdd("./bdd/settings.json", settings);
                message.channel.send(" mode test désactivé pour "+args[2])
            }
            else message.reply("Error : "+args[2]+" not found");
    }
    
}

module.exports.config = {
    name: "modeTest"
}

