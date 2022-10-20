// require Librairies
const Discord   = require('discord.js');
const fs        = require('fs');

// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");

const { saveBDD } = require('../fonctions');
const { verifNoDoublon, makeBotWarResponse, placeToPoint } = require('../controller/botWarController');


module.exports.run = async (bot, message, args) =>
{
    const id_channel = message.channel.id;
    const race = args[8];
    const nameMap = args[7];
    const places = [args[1],args[2],args[3],args[4],args[5],args[6]];
    let raceData = (race-1);
    let regexNumber = /\d/;
    console.log(race, !isNaN(race));
    if(bdd_botwar["botwar"][id_channel]) //id existant
    {
        if(race > bdd_botwar["botwar"][id_channel]["paramWar"]["race"] || race <= 0 || isNaN(race))
        {
            message.channel.send(`${race} n'est pas un numéro de map valide`);
            return;
        }
        let doublon = verifNoDoublon(places);
        if(doublon)
        {
            message.channel.send("Tu as mis deux fois la même place");
            return;
        }
        let scoreYF = placeToPoint(places);
        if(!scoreYF)
        {
            message.reply(`${args[1]}, ${args[2]}, ${args[3]}, ${args[4]}, ${args[5]}, ${args[6]} : une des places n'est pas comprises entre 1 et 12`);
            return;
        }
        let countdiff       = 0;
        let scoreAdv        = 82-scoreYF;
        let scoreDiff       = scoreYF-scoreAdv;
        let scoreBeforeYF   = bdd_botwar["botwar"][id_channel]["team1"]["TotalYF"];
        let scoreBeforeAdv  = bdd_botwar["botwar"][id_channel]["team2"]["TotalADV"];
        let penaYF          = bdd_botwar["botwar"][id_channel]["team1"]["PenaYF"];
        let penaADV         = bdd_botwar["botwar"][id_channel]["team2"]["PenaADV"];

        scoreBeforeYF       -= bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"][raceData];
        scoreBeforeAdv      -= bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"][raceData];
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"][raceData] = scoreDiff;

        scoreBeforeYF       += scoreYF;
        scoreBeforeAdv      += scoreAdv;

        bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"][raceData]   = scoreYF;
        bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"][raceData]  = scoreAdv;
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"][raceData]   = scoreDiff;


        bdd_botwar["botwar"][id_channel]["team1"]["TotalYF"]                = scoreBeforeYF;
        bdd_botwar["botwar"][id_channel]["team2"]["TotalADV"]               = scoreBeforeAdv;
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapMap"][raceData]    = nameMap;

        for(let value of bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"])
        {
            countdiff += value;
        }
        countdiff += (penaYF*(-20))+(penaADV*20);
        bdd_botwar["botwar"][id_channel]["paramWar"]["totaleDiff"] = countdiff;
        
        saveBDD("./bdd/bot-war.json", bdd_botwar);

        const response = makeBotWarResponse(id_channel, raceData, nameMap);
        console.log(response);
        message.channel.send(response);
        
    }
    else
    {
        message.reply("Il n'y a pas de war");
    }
}

module.exports.config = {
    name: "er"
}
