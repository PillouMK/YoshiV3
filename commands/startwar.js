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
    console.log(1);
    let id_channel  = message.channel.id;
    let id_key      = bdd_botwar["botwar"];
    let id_exist    = false;
    for(let id_BDD in id_key)
    {
        if(id_BDD === id_channel)
        {
            id_exist = true;
        }
    }
    if(!id_exist)
    {
        message.channel.send("Début du war entre "+args[1]+" et "+args[2]);
        let yf  = args[1];
        let adv = args[2];
        bdd_botwar["botwar"][id_channel] = {
            team1: {
                "NameTeam":yf,
                "PenaYF":0,
                "TotalYF":0,
                "recapScoreYF":[]

            },
            team2: {
                "NameTeam":adv,
                "PenaADV":0,
                "TotalADV":0,
                "recapScoreADV":[]
            },
            paramWar: {
                verifDoublon:"",
                race:0,
                totaleDiff:0,
                recapMap: [],
                recapDiff: []
            }
        };
        
        saveBDD("./bdd/bot-war.json", bdd_botwar);
    }
    else
    {
        message.channel.send("Il y a déjà un war en cours");
    }
    
}

module.exports.config = {
    name: "startwar"
}