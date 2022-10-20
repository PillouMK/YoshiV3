// require Librairies
const Discord   = require('discord.js');
const fs        = require('fs');

// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");
const settings      = require("../bdd/settings.json");

// require classes
const { saveBDD } = require('../fonctions');

module.exports.run = async (bot, message, args) =>
{

    let id_channel = message.channel.id;
    let id_key = bdd_botwar["botwar"];
    let id_exist = false;
    for(let id_BDD in id_key)
    {
        if(id_BDD === id_channel)
        {
            id_exist = true;
        }
    }
    if(id_exist)
    {
        let totalScore  = id_key[id_channel]["paramWar"]["totaleDiff"];
        let totalYF  	= id_key[id_channel]["team1"]["TotalYF"];
        let totalAdv  	= id_key[id_channel]["team2"]["TotalADV"];
        if(totalScore > 0) {
            message.channel.send("Fin du war, victoire "+totalYF+" à "+totalAdv+" (+"+totalScore+")  <:ultraYF:929784961341481031>");
        } else if(totalScore < 0) {
            message.channel.send("Fin du war, défaite "+totalYF+" à "+totalAdv+" ("+totalScore+") <:evolitoutrouge:931267504360292423>");
        } else {
            message.channel.send("Fin du war, égalité "+totalYF+" à "+totalAdv+" (+"+totalScore+") <:alexxx:596506197008449536>");
        }
        
        delete bdd_botwar["botwar"][id_channel];
        saveBDD("./bdd/bot-war.json", bdd_botwar);
    }
    else
    {
        message.channel.send("Il n'y a pas de war");
    }
    
}

module.exports.config = {
    name: "stopwar"
}