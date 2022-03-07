const Discord = require('discord.js');
const fs = require('fs');

const bdd_fc = require("../bdd/fc.json");

function Savebdd()
{
    fs.writeFile("./bdd/fc.json", JSON.stringify(bdd_fc, null, 4), (err) =>
    {
        console.log('BDD save');
        if(err) message.channel.send("Une erreur est survenue");
    });
}

module.exports.run = async (bot, message, args) =>
{
    let id_author = message.author.id;
    console.log(id_author);
    if(args.length === 1)
    {
        if(bdd_fc["friendcode"][id_author])
        {
            message.channel.send(bdd_fc["friendcode"][id_author]);
        }
        else{
            message.channel.send("Je ne connais pas ton fc, fais !setfc [fc] pour l'enregistrer");
        }
    }
    else if(args.length > 1)
    {
        let usermention = message.mentions.members.first();
        console.log(usermention.id);
        if(bdd_fc["friendcode"][usermention.id])
        {
            message.channel.send(bdd_fc["friendcode"][usermention.id]);
        }
        else
        {
            message.reply("l'utilisateur mentionné n'a pas son code ami d'enregistré");
        }
    }
}

module.exports.config = {
    name: "fc"
}
