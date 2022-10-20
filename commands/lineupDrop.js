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


module.exports.run = async (bot, message, args) =>
{

    let membre;
    let membreObject;
    let horaireList = [];

    // console.log(message.mentions.members.first());
    if(message.mentions.members.first())
    {
        membre = message.mentions.members.first().user
    } else {
        membre = message.member.user;
    }

    // Enregistrement des horaires
    for(element in args){
        if(message.author.id === "156445194861019136") {
                args[element] = (parseInt(args[element]) + 1).toString()
            }
        if(numberTest.test(args[element]) && args[element].length == 2){
                horaireList.push(args[element]);
        }
    }

    membreObject = new User(membre.id, membre.username);
    
    // Vérif nombre arguments
    if(horaireList.length > 0)
    {
        horaireList.forEach(element => {
            let timeStamp = adaptHour(element, settings.decalageHoraire);
    
            if(bdd_lineup[element])
            {
                // Vérif si joueur déjà enregistré
                if(bdd_lineup[element]["can"].findIndex(x => x.id === membreObject.id) != -1)
                {
                    let index = bdd_lineup[element]["can"].findIndex(x => x.id === membreObject.id);
                    bdd_lineup[element]["can"].splice(index, 1);
                    message.channel.send(membreObject.name+ " a bien été retiré pour "+"<t:"+timeStamp+":t> !");
                    saveBDD("./bdd/lineup.json", bdd_lineupRequire);
                } 
                else if(bdd_lineup[element]["maybe"].findIndex(x => x.id === membreObject.id) != -1)
                {
                    let index = bdd_lineup[element]["maybe"].findIndex(x => x.id === membreObject.id);
                    bdd_lineup[element]["maybe"].splice(index, 1);
                    message.channel.send(membreObject.name+ " a bien été retiré pour "+"<t:"+timeStamp+":t> !");
                    saveBDD("./bdd/lineup.json", bdd_lineupRequire);
                }
                else {
                    message.channel.send(membreObject.name+ " a bien été retiré pour "+"<t:"+timeStamp+":t> !");;
                }
                
            }
            // créer la line up car elle existe pas
            else 
            {
                message.reply("Il n'y a pas de line up pour "+"<t:"+timeStamp+":t>");
            }
        });
    }
    else
    {
        message.reply("Aucun horaire valide");
    }
    message.delete();
}

module.exports.config = {
    name: "drop"
}