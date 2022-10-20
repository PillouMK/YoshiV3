// require Librairies
const Discord = require('discord.js');
const fs = require('fs');

// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");
const settings          = require("../bdd/settings.json");

// require classes
const { saveBDD } = require('../fonctions');
const { verifNoDoublon, makeBotWarResponse, placeToPoint } = require('../controller/botWarController');
const { getAllMaps } = require("../controller/apiController");

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    const id_channel = message.channel.id;
    const nameMap = args[7];
    const places = [args[1],args[2],args[3],args[4],args[5],args[6]];
    let race = bdd_botwar["botwar"][id_channel]["paramWar"]["race"];
    if(!bdd_botwar["botwar"][id_channel])
    {
        message.reply("Il n'y a pas de war");
        return;
    }
    let verifDoubleMSG = bdd_botwar["botwar"][id_channel]["paramWar"]["verifDoublon"];
    if(message.content === verifDoubleMSG)
    {
        bdd_botwar["botwar"][id_channel]["paramWar"]["verifDoublon"] = "";
        message.channel.send("J'ai reçu deux fois de suite la même commande, si c'était volontaire réessaye");
        saveBDD("./bdd/bot-war.json", bdd_botwar);
        return;
    }
    bdd_botwar["botwar"][id_channel]["paramWar"]["verifDoublon"] = message.content;
    let doublon = verifNoDoublon(places);
    if(doublon)
    {
        message.channel.send("Tu as mis deux fois la même place");
        return;
    }

    let mapsArray = await getAllMaps();
    if(mapsArray.statusCode === 200) {
        if(mapsArray.data.findIndex(x => x.idMap === nameMap) == -1) {
            message.channel.send(`${nameMap} n'est pas un nom de map valide`);
            return;
        }
    } else {
        message.reply("Erreur API, je ne peux pas vérifier l'id de la map");
    }
    
        
    let scoreYF = placeToPoint(places);
    console.log("scoreYF", scoreYF)
    if(!scoreYF)
    {
        message.reply(`${args[1]}, ${args[2]}, ${args[3]}, ${args[4]}, ${args[5]}, ${args[6]} : une des places n'est pas comprises entre 1 et 12`);
        return;
    }
    let countdiff   = 0;
    let scoreAdv    = 82-scoreYF;
    let scoreDiff   = scoreYF-scoreAdv;
    let penaYF      = bdd_botwar["botwar"][id_channel]["team1"]["PenaYF"];
    let penaADV     = bdd_botwar["botwar"][id_channel]["team2"]["PenaADV"];

    bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"][race]     = scoreYF;
    bdd_botwar["botwar"][id_channel]["team1"]["TotalYF"]                += scoreYF;
    bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"][race]    = scoreAdv;
    bdd_botwar["botwar"][id_channel]["team2"]["TotalADV"]               += scoreAdv;
    bdd_botwar["botwar"][id_channel]["paramWar"]["recapMap"][race]      = nameMap
    bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"][race]     = scoreDiff;
        
    for(let value of bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"])
    {
        countdiff += value;
    }
    countdiff += (penaYF*(-20))+(penaADV*20);
    bdd_botwar["botwar"][id_channel]["paramWar"]["totaleDiff"] = countdiff;
    bdd_botwar["botwar"][id_channel]["paramWar"]["race"]++;

    await saveBDD("./bdd/bot-war.json", bdd_botwar);
        
    const response = makeBotWarResponse(id_channel, race, nameMap, bdd_botwar);
    message.channel.send({content : response});
        
}

module.exports.config = {
    name: "race"
}
