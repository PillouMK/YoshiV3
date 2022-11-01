// require Librairies
const Discord   = require('discord.js');
// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");

// require classes
const { saveBDD } = require('../fonctions');

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{

    let id_channel  = message.channel.id;
    let id_key = bdd_botwar["botwar"];

    for(let id_BDD in id_key)
    {
        if(id_BDD === id_channel) return message.reply({content: "Il y a déjà un war en cours"});
    }

    if(args.length != 3) return message.reply({content: "Tu dois indiquer deux équipes"})
    

    let yf = args[1];
    let adv = args[2];
    let saveStats = false;

    // check roster for projectMap
    if(yf.toUpperCase() === "YFG" || yf.toUpperCase() === "YF1") {
        yf = "YFG";
        saveStats = true;
    } else if (yf.toUpperCase() === "YFO" || yf.toUpperCase() === "YF2") {
        saveStats = true;
        yf = "YFO";
    }
     bdd_botwar["botwar"][id_channel] = {
        team1: {
            nameTeam: yf,
            penaYF: 0,
            totalYF: 0,
            recapScoreYF: []
        },
        team2: {
            nameTeam: adv,
            penaADV: 0,
            totalADV: 0,
            recapScoreADV: []
        },
        paramWar: {
            verifDoublon: "",
            saveStats : saveStats,
            isStoppable : false,
            race: 0,
            totaleDiff: 0,
            recapMap: [],
            recapDiff: []
        }
    };
    saveBDD("./bdd/bot-war.json", bdd_botwar);
    message.channel.send({content : `Début du war entre ${yf} et ${adv}`});
    if(!saveStats) {
        message.reply({content: `Tu n'as pas indiqué de roster précis, j'assume donc qu'il ne faut pas enregistrer les données pour le ProjectMap\nSi tu t'es trompé, fais **!set_team YFG** ou **!set_team YFO** pour activer la sauvegarde à tout moment`})
    } else {
        message.reply({content: `Tu as indiqué ${yf}, je vais donc enregistrer les données pour le ProjectMap\nSi tu t'es trompé, fais **!set_team YF** pour annuler la sauvegarde à tout moment`})
    }

    
}

module.exports.config = {
    name: "startwar"
}