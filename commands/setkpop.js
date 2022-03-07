const Discord = require('discord.js');
const fs = require('fs');

const bdd_gif = require("../bdd/allset.json");

function Savebdd()
{
    fs.writeFile("./bdd/allset.json", JSON.stringify(bdd_gif, null, 4), (err) =>
    {
        console.log('BDD save');
        if(err) message.channel.send("Une erreur est survenue");
    });
}


module.exports.run = async (bot, message, args) =>
{
    let testlink = /https:\/\//;
    let autId = message.author.id;
    if(autId === "538433520515678209" || autId === "450353797450039336" )
    {
        if(args.length > 1)
        {
            if(testlink.test(args[1]))
            {
                if(bdd_gif["database"]["kpop"].indexOf(args[1]) === -1)
                {
                    bdd_gif["database"]["kpop"].push(args[1]);
                    console.log(args[1]);
                    message.reply("gif de kpop enregistré avec succès!");
                    message.delete();
                    Savebdd();
                }
                else
                {
                    message.reply("J'ai déjà ce gif dans ma base de donnée!");
                }
            }
            else
            {
                message.reply("Tu dois me donner un lien de gif!");
            }
        }
    }
    else
    {
        message.reply("Tu n'as pas les permissions d'utiliser cette commande");
    }
}

module.exports.config = {
    name: "setkpop"
}
