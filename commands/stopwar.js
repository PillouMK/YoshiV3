// require Librairies
const Discord   = require('discord.js');
const fs        = require('fs');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType  } = require('discord.js');

// require BDD
const bdd_botwar    = require("../bdd/bot-war.json");


// require methods
const { saveBDD } = require('../fonctions');
const { postProjectMap } = require('../controller/apiController');
const { updateProjectMapRanking } = require("../controller/projectMapController");
/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{

    let id_channel = message.channel.id;
    let id_key = bdd_botwar["botwar"];
    let id_exist = false;
    for(let id_BDD in id_key)
    {
        if(id_BDD === id_channel)
        {
            id_exist = true;
        }
    }
    if(id_exist)
    {
        let war = bdd_botwar["botwar"][id_channel];
        if(!war.paramWar.isStoppable && war.paramWar.recapMap.length < 12) {
            try {
                const buttons = makeListButton();
                message.reply({content: "Le war n'a pas atteint 12 maps, veux-tu vraiment l'arrêter ?", components: [buttons] }).then((messageReaction) => {
                    const collectorButton = messageReaction.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3600000 });
        
                    collectorButton.on('collect', async i => { 
                        if(i.customId === "oui") {
                            await i.deferUpdate();
                            stopWar(war, message, id_channel);
                            messageReaction.edit({content: "Le war a été terminé", components: [] });
                        }
                        if(i.customId === "non") {
                            await i.deferUpdate();
                            messageReaction.edit({content: "Le war n'a pas été terminé", components: [] });
                        }
                    });
        
                    collectorButton.on('end', async i => {
                        messageReaction.edit({components: []});
                    })
                }
                );
            } catch(error) { 
                console.log(error)
            }
            
            return;
        } 
        stopWar(war, message, id_channel);
        
    }
    else
    {
        message.channel.send({content: "Il n'y a pas de war"});
    }
    
}

const stopWar = async (war, message, id_channel) => {
    let totalScore  = war.paramWar.totaleDiff;
    let totalYF  	= war.team1.totalYF;
    let totalAdv  	= war.team2.totalADV;
    if(totalScore > 0) {
        message.channel.send({content: `Fin du war, victoire ${totalYF} à ${totalAdv} (${totalScore}) <:ultraYF:929784961341481031>`});
    } else if(totalScore < 0) {
        message.channel.send({content:`Fin du war, défaite ${totalYF} à ${totalAdv} (${totalScore}) <:evolitoutrouge:931267504360292423>`});
    } else {
        message.channel.send({content:`Fin du war, égalité ${totalYF} à ${totalAdv} (${totalScore}) <:alexxx:596506197008449536>`});
    }
    if(war.paramWar.saveStats && war.paramWar.recapMap.length >= 8) {
        const scoreMatch = totalScore;
        const idRoster = war.team1.nameTeam;
        let scoreMaps = [];
        war.paramWar.recapMap.forEach((element, index) => {
            let scoreMap = {
                idMap : element,
                scoreMap : war.paramWar.recapDiff[index]
            }
            scoreMaps.push(scoreMap);
        });
        let projectMap = await postProjectMap(scoreMaps, scoreMatch, idRoster);
        if(projectMap.statusCode === 201) {
            message.channel.send({content: "Sauvegarde des données effectuées"});
            updateProjectMapRanking(bot, idRoster);
        } else {
            message.channel.send({content: "Une erreur est survenue lors de la sauvegarde des données"});
            console.log(projectMap);
        }       
    } else {
        message.channel.send({content: "Pas de sauvegardes"});
    }
    delete bdd_botwar["botwar"][id_channel];
    saveBDD("./bdd/bot-war.json", bdd_botwar);
}

const makeListButton = () => {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`oui`)
                .setLabel('Oui')
                .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`non`)
                .setLabel('Non')
                .setStyle(ButtonStyle.Danger)
        )
        return row;
}

module.exports.config = {
    name: "stopwar"
}