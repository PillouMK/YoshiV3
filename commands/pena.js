// require Librairies
const Discord = require('discord.js');
const fs = require('fs');

// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");
const settings          = require("../bdd/settings.json");

// require classes
const { saveBDD } = require('../fonctions');


module.exports.run = async (bot, message, args) =>
{
    
    let id_channel = message.channel.id;
    if(bdd_botwar["botwar"][id_channel]) //id existant
    {
        
       if(args[1] === "YF" || args[1] === "yf")
       {
           bdd_botwar["botwar"][id_channel]["team1"]["penaYF"]          ++;
           bdd_botwar["botwar"][id_channel]["team1"]["totalYF"]         -= 20;
           bdd_botwar["botwar"][id_channel]["paramWar"]["totaleDiff"]   -= 20;

           let team1 = bdd_botwar["botwar"][id_channel]["team1"]["nameTeam"];
           message.channel.send("Pénalité bien ajouté à la "+team1);
       }
       else if(args[1] === "adv" || args[1] === "ADV")
        {
            bdd_botwar["botwar"][id_channel]["team2"]["penaADV"]        ++;
            bdd_botwar["botwar"][id_channel]["team2"]["totalADV"]       -= 20;
            bdd_botwar["botwar"][id_channel]["paramWar"]["totaleDiff"]  += 20;
            
            let team2 = bdd_botwar["botwar"][id_channel]["team2"]["nameTeam"];
            message.channel.send("Pénalité bien ajouté à la "+team2);
        }
        else
        {
            message.channel.send("Le format de la commande !péna doit être sous la forme: \"!pena YF\" ou \"!pena adv\"");
        }
        saveBDD("./bdd/bot-war.json", bdd_botwar);
    }
    else
    {
        message.reply("Il n'y a pas de war");
    }
}

module.exports.config = {
    name: "pena"
}

