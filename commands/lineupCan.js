// require Librairies
const Discord = require('discord.js');
const fs = require('fs');

// require BDD
const bdd_lineupRequire = require("../bdd/lineup.json");
const bdd_lineup        = bdd_lineupRequire.lineUp;
const settings          = require("../bdd/settings.json");

// require classes
const User          = require('../class/User');
const Fonctions     = require('../fonctions');
const fct           = new Fonctions();

// Regex pattern
const numberTest = /(0[\d]{1})|(1[\d]{1})|(2[0-3]{1})/;


module.exports.run = async (bot, message, args) =>
{
    // mode test (line up)
    if(!fct.isModeTest(settings.modeTest.lineup, settings.idAdmin, message.author.id)) { 
        console.log("missing permissions");
        message.reply("commande désactivée");
        return
    }

    let membre;
    let membreObject;
    let horaireList = [];
    let mute = false;

    // Enregistrement du membre
    if(message.mentions.members.first())
    {
        membre = message.mentions.members.first().user
    } else {
        membre = message.member.user;
    }

    // Enregistrement des horaires
    for(element in args){
        if(message.author.id === "156445194861019136") {
                args[element] = (parseInt(args[element]) + 1).toString();
        }
        if(numberTest.test(args[element]) && args[element].length == 2){
            horaireList.push(args[element]);
        }
        if(args[element].toUpperCase() == "MUTE"){
            mute = true;
            console.log(mute);
        }
    }
    
    membreObject = new User(membre.id, membre.username, mute);

    
    // Vérif nombre arguments
    if(horaireList.length > 0)
    {
        // Parcours des horaires
        horaireList.forEach(element => {
            let now = new Date(Date.now());
            now.setHours(element-1, 0, 0, 0);
            let timeStamp = now/1000;
            
            if(bdd_lineup[element])
            {
               
                if(bdd_lineup[element]["maybe"].findIndex(x => x.id === membreObject.id) != -1){
                    let index = bdd_lineup[element]["maybe"].findIndex(x => x.id === membreObject.id)
                    bdd_lineup[element]["maybe"].splice(index, 1);
                    fct.savebdd("./bdd/lineup.json", bdd_lineupRequire);
                }
                // Vérif si joueur déjà enregistré
                if(bdd_lineup[element]["can"].findIndex(x => x.id === membreObject.id) == -1)
                {
                    // Enregistre le joueur
                    bdd_lineup[element]["can"].push(membreObject);
                    message.channel.send(membreObject.name+ " a bien été ajouté pour "+"<t:"+timeStamp+":t> !");
                    fct.savebdd("./bdd/lineup.json", bdd_lineupRequire);
                    
                } else if (bdd_lineup[element]["can"][bdd_lineup[element]["can"].findIndex(x => x.id === membreObject.id)].mute != mute) {
                    bdd_lineup[element]["can"][bdd_lineup[element]["can"].findIndex(x => x.id === membreObject.id)].mute = mute;
                    let msgMute = mute ?  "mute" : "unmute";
                    message.channel.send(membreObject.name+" est maintenant "+ msgMute +" pour <t:"+timeStamp+":t>");
                    fct.savebdd("./bdd/lineup.json", bdd_lineupRequire);
                }
                else 
                {
                    message.channel.send(membreObject.name+" est déjà dans la line up de "+"<t:"+timeStamp+":t>");
                }
                
            }
            // créer la line up car elle existe pas
            else 
            {
                bdd_lineup[element] = {
                    "can": [],
                    "maybe": [],
                }
                // Enregistre le joueur ayant créé la line up
                bdd_lineup[element]["can"].push(membreObject);
                message.channel.send(membreObject.name+ " a bien été ajouté pour "+"<t:"+timeStamp+":t>");
                fct.savebdd("./bdd/lineup.json", bdd_lineupRequire);
            }
        })
    }
    else
    {
        message.reply("Aucun horaire valide n'a été fourni");
    }
}

module.exports.config = {
    name: "can"
}