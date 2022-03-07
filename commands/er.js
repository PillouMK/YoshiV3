// require Librairies
const Discord   = require('discord.js');
const fs        = require('fs');

// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");
const settings      = require("../bdd/settings.json");

// require classes
const Fonctions     = require('../fonctions');
const fct           = new Fonctions();


module.exports.run = async (bot, message, args) =>
{
    // mode test (botwar)
    if(!fct.isModeTest(settings.modeTest.botwar, settings.idAdmin, message.author.id)) { 
        message.reply("commande désactivée");
        return 
    }

    let id_channel = message.channel.id;
    if(bdd_botwar["botwar"][id_channel]) //id existant
    {
        if(args[1] > bdd_botwar["botwar"][id_channel]["paramWar"]["race"] || args[1] <= 0)
        {
            message.channel.send('La map indiqué doit être comprise entre 1 et 12 et ne pas dépasser le nombre de course jouée à l\'instant t');
            return;
        }
        let doublon = fct.verifNoDoublon(args[3],args[4],args[5],args[6],args[7],args[8]);
        if(doublon)
        {
            message.channel.send("Tu as mis deux fois la même place");
            return;
        }
        let scoreYF = fct.placeToPoint(args[3],args[4],args[5],args[6],args[7],args[8]);
        if(!scoreYF)
        {
            message.reply("une des places n'est pas comprise entre 1 et 12");
            return;
        }
        let countdiff       = 0;
        let scoreAdv        = 82-scoreYF;
        let scoreDiff       = scoreYF-scoreAdv;
        let race            =  args[1];
        let scoreBeforeYF   = bdd_botwar["botwar"][id_channel]["team1"]["TotalYF"];
        let scoreBeforeAdv  = bdd_botwar["botwar"][id_channel]["team2"]["TotalADV"];
        let penaYF          = bdd_botwar["botwar"][id_channel]["team1"]["PenaYF"];
        let penaADV         = bdd_botwar["botwar"][id_channel]["team2"]["PenaADV"];

        scoreBeforeYF       -= bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"][race-1];
        scoreBeforeAdv      -= bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"][race-1];
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"][race-1] = scoreDiff;

        scoreBeforeYF       += scoreYF;
        scoreBeforeAdv      += scoreAdv;

        bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"][race-1]   = scoreYF;
        bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"][race-1]  = scoreAdv;
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"][race-1]   = scoreDiff;


        bdd_botwar["botwar"][id_channel]["team1"]["TotalYF"]                = scoreBeforeYF;
        bdd_botwar["botwar"][id_channel]["team2"]["TotalADV"]               = scoreBeforeAdv;
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapMap"][race-1]    = args[2];

        for(let value of bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"])
        {
            countdiff += value;
        }
        countdiff += (penaYF*(-20))+(penaADV*20);
        bdd_botwar["botwar"][id_channel]["paramWar"]["totaleDiff"] = countdiff;
        
        fct.savebdd("./bdd/bot-war.json", bdd_botwar);

        let team1           = bdd_botwar["botwar"][id_channel]["team1"]["NameTeam"];
        let team2           = bdd_botwar["botwar"][id_channel]["team2"]["NameTeam"];
        let newTotalYF      = bdd_botwar["botwar"][id_channel]["team1"]["TotalYF"];
        let newTotalAdv     = bdd_botwar["botwar"][id_channel]["team2"]["TotalADV"];
        let newRace         = bdd_botwar["botwar"][id_channel]["paramWar"]["race"];
        let recapYF         = bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"];
        let recapADV        = bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"];
        let recapDifShow    = bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"];
        let recapMapShow    = bdd_botwar["botwar"][id_channel]["paramWar"]["recapMap"];
        let penaYFshow      = "";
        let penaADVshow     = "";
        
        if(penaYF > 0)
        {
            penaYFshow = "Pénalité(s): "+penaYF+" ("+(penaYF*20)+" pts)";
        }
        if(penaADV > 0)
        {
            penaADVshow = "Pénalité(s): "+penaADV+" ("+(penaADV*20)+" pts)";
        }

        let recap_this_course   = "```Course n°"+(race)+" "+"("+args[2]+")\n"+team1+" = "+scoreYF+"\n"+team2+" = "+scoreAdv+"\n    Différences : "+scoreDiff+"```";
        let recap_this_war      = "```Score total après la course n°"+(newRace)+"\n"+team1+" = "+newTotalYF+"    "+penaYFshow+"\n"+team2+" = "+newTotalAdv+"    "+penaADVshow+"\n    Différence totale : "+countdiff+"```";
        
        let recap_map = "";
            for(let o = 0;o<newRace;o++)
            {
                if(o<9)
                {
                    recap_map += (o+1)+"  | "+team1+" "+recapYF[o]+" - "+recapADV[o]+" "+team2+" ("+recapDifShow[o]+") sur "+recapMapShow[o]+"\n";
                }
                else{
                    recap_map += (o+1)+" | "+team1+" "+recapYF[o]+" - "+recapADV[o]+" "+team2+" ("+recapDifShow[o]+") sur "+recapMapShow[o]+"\n";
                }
                
            }
        let recap_all_map = "```Récapitulatif des courses :\n"+recap_map+"```";
        console.log(recap_this_course+recap_this_war);
        message.channel.send(recap_this_course+recap_this_war+recap_all_map);
        
    }
    else
    {
        message.reply("Il n'y a pas de war");
    }
}

module.exports.config = {
    name: "er"
}
