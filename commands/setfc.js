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
    let regEx = /[0-9][0-9][0-9][0-9]\-[0-9][0-9][0-9][0-9]\-[0-9][0-9][0-9][0-9]/;
    if(args.length === 2)
    {
        let fc = args[1];
        if(regEx.test(fc))
        {
            bdd_fc["friendcode"][id_author] = fc;
            Savebdd();
            message.reply("code ami enregistré");
        }
        else{
            message.reply("Le code ami doit être au format \"xxxx-xxxx-xxxx\"");
        }
    }
    else if(args.length > 1)
    {
        let fc = args[2];
        let usermention = message.mentions.members.first();
        if(regEx.test(fc))
        {
            bdd_fc["friendcode"][usermention.id] = fc;
            Savebdd();
            message.reply("code ami enregistré");
        }
        else{
            message.reply("Le code ami doit être au format \"xxxx-xxxx-xxxx\"");
        }
    }
}


module.exports.config = {
    name: "setfc"
}
