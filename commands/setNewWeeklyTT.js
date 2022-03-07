const Discord = require('discord.js');
const fs = require('fs');

const bdd_weeklyTTparam = require("../bdd/weeklyTTparam.json");
const bdd_listMap = require("../bdd/mapurl.json");
const dateDay = new Date();
function Savebdd()
{
    fs.writeFile("./bdd/weeklyTTparam.json", JSON.stringify(bdd_weeklyTTparam, null, 4), (err) =>
    {
        console.log('News maps TT weekly enregistrées');
        if(err) message.channel.send("Une erreur est survenue");
    });
}

module.exports.run = async (bot, message, args) =>
{
    console.log(args.length)
    if(args.length == 3)
    {
        let verifmap = bdd_listMap.map
        console.log((args[1] in verifmap));
        console.log((args[2] in verifmap));
        if((args[1] in verifmap) && (args[2] in verifmap))
        {
            // recup la date
            let day = dateDay.getDate();
            let month = dateDay.getMonth()
            month = parseInt(month);
            month++;
            let year = dateDay.getFullYear();
            if(month.length < 2)
            {
                month += "0"
            }
            bdd_weeklyTTparam.weeklyTT.date = day + "/" + month + "/" + year;
            bdd_weeklyTTparam.weeklyTT.map1 = args[1];
            bdd_weeklyTTparam.weeklyTT.map1 = args[2];
            Savebdd();
            message.channel.send("Nouvelle map pour le TT Weekly à compté du "+bdd_weeklyTTparam.weeklyTT.date+" : "+args[1]+" et "+args[2]);
        }
        else
        {
            if(!(args[1] in verifmap))
            {
                message.reply(args[1]+" n'est pas une map");
            }
            else
            {
                message.reply(args[2]+" n'est pas une map");  
            }
        }

    }
    else
    {
        message.reply("Il manque des paramètres");      
    }
}

module.exports.config = {
    name: "setWeeklyTT"
}
