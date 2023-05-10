// require Librairies
const Discord   = require('discord.js');

// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");

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
    if(args.length != 9) return message.reply({content : `Nombre de paramètre incorrects (reçu ${args.length-1}, attendu : 8)`})
    const id_channel = message.channel.id;
    const race = args[8];
    const nameMap = args[7];
    const places = [args[1],args[2],args[3],args[4],args[5],args[6]];
    let raceData = (race-1);
    if(bdd_botwar["botwar"][id_channel]) //id existant
    {
        if(race > bdd_botwar["botwar"][id_channel]["paramWar"]["race"] || race <= 0 || isNaN(race))
        {
            message.reply({content: `${race} n'est pas un numéro de map valide`});
            return;
        }
        let doublon = verifNoDoublon(places);
        if(doublon)
        {
            message.reply({content: "Tu as mis deux fois la même place"});
            return;
        }
        let scoreYF = placeToPoint(places);
        if(!scoreYF)
        {
            message.reply({content: `${args[1]}, ${args[2]}, ${args[3]}, ${args[4]}, ${args[5]}, ${args[6]} : une des places n'est pas comprises entre 1 et 12`});
            return;
        }

        let mapsArray = await getAllMaps();
        if(mapsArray.statusCode === 200) {
            if(mapsArray.data.findIndex(x => x.idMap === nameMap) == -1) {
                message.channel.send(`${nameMap} n'est pas un nom de map valide`);
                return;
            }
        } else {
            message.reply({content: "Erreur API, je ne peux pas vérifier l'id de la map, je désactive la sauvegarde des données"});
            bdd_botwar.botwar[id_channel].paramWar.saveStats = false;
        }
        let countdiff       = 0;
        let scoreAdv        = 82-scoreYF;
        let scoreDiff       = scoreYF-scoreAdv;
        let scoreBeforeYF   = bdd_botwar["botwar"][id_channel]["team1"]["totalYF"];
        let scoreBeforeAdv  = bdd_botwar["botwar"][id_channel]["team2"]["totalADV"];
        let penaYF          = bdd_botwar["botwar"][id_channel]["team1"]["penaYF"];
        let penaADV         = bdd_botwar["botwar"][id_channel]["team2"]["penaADV"];

        scoreBeforeYF       -= bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"][raceData];
        scoreBeforeAdv      -= bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"][raceData];
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"][raceData] = scoreDiff;

        scoreBeforeYF       += scoreYF;
        scoreBeforeAdv      += scoreAdv;

        bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"][raceData] = scoreYF;
        bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"][raceData] = scoreAdv;
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"][raceData] = scoreDiff;


        bdd_botwar["botwar"][id_channel]["team1"]["totalYF"] = scoreBeforeYF;
        bdd_botwar["botwar"][id_channel]["team2"]["totalADV"] = scoreBeforeAdv;
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapMap"][raceData] = nameMap;

        for(let value of bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"])
        {
            countdiff += value;
        }
        countdiff += (penaYF*(-20))+(penaADV*20);
        bdd_botwar["botwar"][id_channel]["paramWar"]["totaleDiff"] = countdiff;
        
        saveBDD("./bdd/bot-war.json", bdd_botwar);

        const response = makeBotWarResponse(id_channel, raceData, nameMap);
        message.channel.send(response);
        
    }
    else
    {
        message.reply({content: "Il n'y a pas de war"});
    }
}

module.exports.config = {
    name: "er"
}
