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
    if(args.length > 1)
    {
            if(bdd_gif["database"]["beni"].indexOf(args[1]) === -1)
            {
                let newquote = args.shift().join(" ");
                bdd_gif["database"]["beni"].push(newquote);
                console.log("New quote de beni : "+newquote);
                message.reply("quote de béni enregistrée avec succès!\n"+newquote);
                message.delete();
                Savebdd();
            }
            else
            {
                message.reply("J'ai déjà cette quote dans ma base de donnée!");
            }
        }
        else
        {
            message.reply("Tu dois me donner la quote de beni!");
        }
}

module.exports.config = {
    name: "setbeni"
}
