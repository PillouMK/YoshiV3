const Discord = require('discord.js');
const bdd_botwar = require("../bdd/bot-war.json");
const { saveBDD } = require('../fonctions');

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    let id_key = bdd_botwar["botwar"];
    const id_channel = message.channel.id;
    let id_exist = false;
    for(let id_BDD in id_key)
    {
        if(id_BDD === id_channel)
        {
            id_exist = true;
        }
    }

    if(!id_exist) return message.reply({content: "Il n'y a pas de war"});

    if(args.length != 2) return message.reply({content: "Tu dois indiquer YFG ou YFO"});
    
    let team = args[1];
    if(team.toUpperCase() === "YFG" || team.toUpperCase() === "YFO") {
        bdd_botwar.botwar[id_channel].team1.nameTeam = team.toUpperCase();
        bdd_botwar.botwar[id_channel].paramWar.saveStats = true;
        saveBDD("./bdd/bot-war.json", bdd_botwar);
        message.reply({content: `**${team}** enregistré, j'active la sauvegarde des données`});
    } else {
        bdd_botwar.botwar[id_channel].team1.nameTeam = team.toUpperCase();
        bdd_botwar.botwar[id_channel].paramWar.saveStats = false;
        saveBDD("./bdd/bot-war.json", bdd_botwar);
        message.reply({content: `**${team}** enregistré, je désactive la sauvegarde des données`});
    } 

}

module.exports.config = {
    name: "set_team"
}
