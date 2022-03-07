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
    if(!fct.isModeTest(settings.modeTest.botwar, settings.idAdmin, message.author.id)) { 
        message.reply("commande désactivée");
        return 
    }

    let id_channel = message.channel.id;
    if(bdd_botwar["botwar"][id_channel])
    {
        let verifDoubleMSG = bdd_botwar["botwar"][id_channel]["paramWar"]["verifDoublon"];
        if(message.content === verifDoubleMSG)
        {
            bdd_botwar["botwar"][id_channel]["paramWar"]["verifDoublon"] = "";
            message.channel.send("J'ai reçu deux fois de suite la même commande, si c'était volontaire réessaye");
            fct.savebdd("./bdd/bot-war.json", bdd_botwar);
            return;
        }
        bdd_botwar["botwar"][id_channel]["paramWar"]["verifDoublon"] = message.content;
        let doublon = fct.verifNoDoublon(args[1],args[2],args[3],args[4],args[5],args[6]);
        if(doublon)
        {
            message.channel.send("Tu as mis deux fois la même place");
            return;
        }
        
        let scoreYF = fct.placeToPoint(args[1],args[2],args[3],args[4],args[5],args[6]);
        if(!scoreYF)
        {
            message.reply("une des places n'est pas comprise entre 1 et 12");
            return;
        }
        let countdiff   = 0;
        let scoreAdv    = 82-scoreYF;
        let scoreDiff   = scoreYF-scoreAdv;
        let race        = bdd_botwar["botwar"][id_channel]["paramWar"]["race"];
        let team1       = bdd_botwar["botwar"][id_channel]["team1"]["NameTeam"];
        let team2       = bdd_botwar["botwar"][id_channel]["team2"]["NameTeam"];
        let penaYF      =  bdd_botwar["botwar"][id_channel]["team1"]["PenaYF"];
        let penaADV     = bdd_botwar["botwar"][id_channel]["team2"]["PenaADV"];

        console.log(race+1);
        bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"][race]     = scoreYF;
        bdd_botwar["botwar"][id_channel]["team1"]["TotalYF"]                += scoreYF;
        console.log("Score YF: "+bdd_botwar["botwar"][id_channel]["team1"]["TotalYF"]);
        bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"][race]    = scoreAdv;
        bdd_botwar["botwar"][id_channel]["team2"]["TotalADV"]               += scoreAdv;
        console.log("Score adv: "+bdd_botwar["botwar"][id_channel]["team2"]["TotalADV"]);
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapMap"][race]      = args[7];
        bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"][race]     = scoreDiff;
        
        for(let value of bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"])
        {
            countdiff += value;
        }
        countdiff += (penaYF*(-20))+(penaADV*20);
        bdd_botwar["botwar"][id_channel]["paramWar"]["totaleDiff"] = countdiff;
        

        
        bdd_botwar["botwar"][id_channel]["paramWar"]["race"]++;
        fct.savebdd("./bdd/bot-war.json", bdd_botwar);
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

        let recap_this_course   = "```\nCourse n°"+(newRace)+" "+"("+args[7]+")\n"+team1+" = "+scoreYF+"\n"+team2+" = "+scoreAdv+"\n    Différences : "+scoreDiff+"\n```";
        let recap_this_war      = "```\nScore total après la course n°"+(newRace)+"\n"+team1+" = "+newTotalYF+"    "+penaYFshow+"\n"+team2+" = "+newTotalAdv+"    "+penaADVshow+"\n    Différence totale : "+countdiff+"\n```";
       
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
        let recap_all_map = "```\nRécapitulatif des courses :\n"+recap_map+"\n```";
        message.channel.send(recap_this_course+recap_this_war+recap_all_map);
        
        
    }
    else
    {
        message.reply("Il n'y a pas de war");
    }
}

module.exports.config = {
    name: "race"
}
