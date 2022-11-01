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
    let horaireList = [];
    let mute = false;
    let isCan = true;

    // Enregistrement du membre
    if(message.mentions.members.first())
    {
        membre = message.mentions.members.first().user
    } else {
        membre = message.member.user;
    }

    // Enregistrement des horaires
    for(element in args){
        if(numberTest.test(args[element]) && args[element].length == 2 && message.author.id === "156445194861019136") {
            if(args[element].toString() == "23") {
                args[element] = "00";
            } else {
                args[element] = (parseInt(args[element]) + 1).toString();
            }
        }
        if(numberTest.test(args[element]) && args[element].length == 2){
            horaireList.push(args[element]);
        }
        if(args[element].toUpperCase() == "MUTE"){
            mute = true;
        }
    }
    
    const membreObject = new User(membre.id, membre.username, mute, isCan);

    
    // Vérif nombre arguments
    if(horaireList.length > 0)
    {
        // Parcours des horaires
        horaireList.forEach(horaire => {
            let timeStamp = adaptHour(horaire, settings.decalageHoraire);
            
            if(!bdd_lineup[horaire])
            {
                bdd_lineup[horaire] = {
                    lu: [],
                }
                // Enregistre le joueur ayant créé la line up
                bdd_lineup[horaire]["lu"].push(membreObject);
                message.channel.send(`${membreObject.name} a bien été ajouté pour <t:${timeStamp}:t>`);
                saveBDD("./bdd/lineup.json", bdd_lineupRequire);

            } else {
                if(bdd_lineup[horaire]["lu"].findIndex(x => x.id === membreObject.id) != -1){
                    let index = bdd_lineup[horaire]["lu"].findIndex(x => x.id === membreObject.id)
                    console.log(bdd_lineup[horaire]["lu"][index].isCan)
                    console.log(bdd_lineup[horaire]["lu"][index].mute == membreObject.mute)
                    if(bdd_lineup[horaire]["lu"][index].isCan && bdd_lineup[horaire]["lu"][index].mute == membreObject.mute) {
                        message.channel.send({content: `${membreObject.name} est déjà dans la line up de <t:${timeStamp}:t>`});
                        return;
                    } 
                    if(bdd_lineup[horaire]["lu"][index].isCan && bdd_lineup[horaire]["lu"][index].mute != membreObject.mute) {
                        bdd_lineup[horaire]["lu"][index].mute = membreObject.mute
                        let isMute = membreObject.mute ? "mute pour" : "unmute pour"
                        message.channel.send({content: `${membreObject.name} est désormais ${isMute} <t:${timeStamp}:t>`});
                        saveBDD("./bdd/lineup.json", bdd_lineupRequire);
                        return;
                    }
                    bdd_lineup[horaire]["lu"][index].isCan = membreObject.isCan
                    message.channel.send({content: `${membreObject.name} confirme pour <t:${timeStamp}:t>`});
                    saveBDD("./bdd/lineup.json", bdd_lineupRequire);
                    return;
                }
                bdd_lineup[horaire]["lu"].push(membreObject);
                let msgIsMute = membreObject.mute ? "en mute" : ""
                message.channel.send({content : `${membreObject.name} a bien été ajouté pour <t:${timeStamp}:t> ${msgIsMute}`});
                saveBDD("./bdd/lineup.json", bdd_lineupRequire);
            }    
        })
    }
    else
    {
        message.channel.send("Aucun horaire valide n'a été fourni");
    }
    message.delete();
}

module.exports.config = {
    name: "can"
}