const Discord = require('discord.js');
const fs = require('fs');

const bdd_fc = require("../bdd/fc.json");

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    const id_author = message.author.id;
    
    if(args.length === 1)
    {
        if(bdd_fc["friendcode"][id_author])
        {
            message.reply({
                content: bdd_fc["friendcode"][id_author]
            });
        }
        else{
            message.reply({
                content: "Je ne connais pas ton fc, fais !set_fc [fc] pour l'enregistrer"
            });
        }
    }
    else if(args.length > 1)
    {
        let usermention = message.mentions.members.first();
        if(!usermention) {
            message.reply({
                content: `${args[1]} n'est pas une mention valide`
            });
            return
        }

        if(bdd_fc["friendcode"][usermention.id])
        {
            message.reply({
                content: bdd_fc["friendcode"][usermention.id]
            });
            return
        }
        else
        {
            message.reply({
                content: "l'utilisateur mentionné n'a pas son code ami d'enregistré"
            });
            return
        }
    }
}

module.exports.config = {
    name: "fc"
}
