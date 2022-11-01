// require Librairies
const Discord   = require('discord.js');
const fs        = require('fs');

// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");


// require methods
const { saveBDD } = require('../fonctions');
const { postProjectMap } = require('../controller/apiController');

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

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
        let war = bdd_botwar["botwar"][id_channel];
        if(!war.paramWar.isStoppable && war.paramWar.recapMap.length < 12) {
            message.reply({content: "Le war n'a pas atteint 12 maps, veux-tu vraiment l'arrêter ? Si oui, réessaye"});
            war.paramWar.isStoppable = true;
            saveBDD("./bdd/bot-war.json", bdd_botwar);
            return;
        } 
        let totalScore  = war.paramWar.totaleDiff;
        let totalYF  	= war.team1.totalYF;
        let totalAdv  	= war.team2.totalADV;
        if(totalScore > 0) {
            message.channel.send({content: `Fin du war, victoire ${totalYF} à ${totalAdv} (${totalScore}) <:ultraYF:929784961341481031>`});
        } else if(totalScore < 0) {
            message.channel.send({content:`Fin du war, défaite ${totalYF} à ${totalAdv} (${totalScore}) <:evolitoutrouge:931267504360292423>`});
        } else {
            message.channel.send({content:`Fin du war, égalité ${totalYF} à ${totalAdv} (${totalScore}) <:alexxx:596506197008449536>`});
        }
        if(war.paramWar.saveStats && war.paramWar.recapMap.length >= 8) {
            const scoreMatch = totalScore;
            const idRoster = war.team1.nameTeam;
            let scoreMaps = [];
            war.paramWar.recapMap.forEach((element, index) => {
                let scoreMap = {
                    idMap : element,
                    scoreMap : war.paramWar.recapDiff[index]
                }
                scoreMaps.push(scoreMap);
            });
            console.log(scoreMatch, idRoster, scoreMaps);
            let projectMap = await postProjectMap(scoreMaps, scoreMatch, idRoster)
            message.channel.send({content: "Sauvegarde des données effectuées"});
        } else {
        message.channel.send({content: "Pas de sauvegardes"});
        }
        
        delete bdd_botwar["botwar"][id_channel];
        saveBDD("./bdd/bot-war.json", bdd_botwar);
    }
    else
    {
        message.channel.send({content: "Il n'y a pas de war"});
    }
    
}

module.exports.config = {
    name: "stopwar"
}