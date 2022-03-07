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

    message.channel.send("[all, lineup, botwar, mku_lu, timetrial, weeklytt, quote]");
    
}

module.exports.config = {
    name: "modeTestList"
}

