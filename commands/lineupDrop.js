// require Librairies
const Discord = require('discord.js');
const fs = require('fs');

// require BDD
const bdd_lineupRequire = require("../bdd/lineup.json");
const bdd_lineup        = bdd_lineupRequire.lineUp;
const settings          = require("../bdd/settings.json");

// require classes
const User          = require('../class/User');
const { saveBDD, adaptHour } = require('../fonctions');

// Regex pattern
const numberTest = /(0[\d]{1})|(1[\d]{1})|(2[0-3]{1})/;

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @param {User} membreObject
 */

module.exports.run = async (bot, message, args) =>
{

    let membre;
    let horaire = (args[1] != undefined) ? args[1] : undefined;
    let member = (args[2] != undefined) ? args[2] : undefined;
    let isValid = false;

    // console.log(message.mentions.members.first());
    if(message.mentions.members.first())
    {
        membre = message.mentions.members.first().user
    } else {
        membre = message.member.user;
    }

    if(args.length > 2) {
        if(args.length == 3 && member != undefined) {
            // rien faire
        } else {
            message.channel.send({content : `Tu ne peux drop que d'un horaire à la fois`});
            return;
        }
        
    }

    // Enregistrement des horaires
    if(horaire != undefined){
        if(message.author.id === "156445194861019136") {
            horaire = (parseInt(horaire) + 1).toString()
            }
        if(numberTest.test(horaire) && horaire.length == 2){
            isValid = true;
        }
    }

    const membreObject = new User(membre.id, membre.username, true, true);
    
    // Vérif nombre arguments
    if(isValid)
    {
            let timeStamp = adaptHour(horaire, settings.decalageHoraire);
    
            if(bdd_lineup[horaire])
            {
                // Vérif si joueur déjà enregistré
                if(bdd_lineup[horaire]["lu"].findIndex(x => x.id === membreObject.id) != -1)
                {
                    let index = bdd_lineup[horaire]["lu"].findIndex(x => x.id === membreObject.id);
                    bdd_lineup[horaire]["lu"].splice(index, 1);
                    message.channel.send({content : `${membreObject.name} a bien été retiré pour <t:${timeStamp}:t> !`});
                    saveBDD("./bdd/lineup.json", bdd_lineupRequire);
                } else {
                    message.channel.send({content :  `${membreObject.name} n'est pas dans la line up de <t:${timeStamp}:t>`})
                }          
            }
            else 
            {
                message.channel.send("Il n'y a pas de line up pour "+"<t:"+timeStamp+":t>");
            }     
    }
    else
    {
        message.channel.send("Aucun horaire valide");
    }
    message.delete();
}

module.exports.config = {
    name: "drop"
}