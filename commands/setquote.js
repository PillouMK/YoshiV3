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
        let a = args.shift();
        let newquote = args.join(" ");
            if(bdd_gif["database"]["quote"].indexOf(newquote) === -1)
            {
                bdd_gif["database"]["quote"].push(newquote);
                console.log("New quote : "+newquote);
                message.reply("quote enregistrée avec succès!");
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
            message.reply("Tu dois me donner la quote!");
        }
}

module.exports.config = {
    name: "setquote"
}
