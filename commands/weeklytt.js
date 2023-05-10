const Discord = require('discord.js');
const fs = require('fs');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType  } = require('discord.js');

const { getWeeklyTT } = require("../controller/apiController");
const { max } = require('moment/moment');
const { msToTime, addBlank } = require('../fonctions');

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
  
    
    let weekly = await getWeeklyTT();
    if(weekly.statusCode != 200) {
        message.reply({
            content: `Erreur API (${weekly.statusCode})`
        });
        console.log(weeklytt.statusCode, weekly.data);
        return;
    }
    let weeklytt = weekly.data.arrayResponse;
    let isShroomless = weeklytt[0].map.isShroomless ? "ni" : "item"
    let currentMap = weeklytt[0].map.idMap+isShroomless
    let responseEmbed = await weeklyEmbedMessage(weeklytt[0]);
    const listButton = makeListButton(weeklytt, currentMap);

    try {
        message.channel.send({embeds : [responseEmbed], components: [listButton]}).then((messageReaction) => {
            
            const collectorButton = messageReaction.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3600000 });

            collectorButton.on('collect', async i => { 
                    await i.deferUpdate();
                    let mapIndex = 0;
                    console.log("i", i.customId);
                    for(let o=0; o<weeklytt.length; o++) {
                        let element = weeklytt[o];
                        let idMap = element.map.idMap;
                        let shroomless = element.map.isShroomless;
                        let isShroomlessStr = shroomless ? "ni" : "item";
                        console.log("test", idMap+isShroomlessStr);
                        if(idMap+isShroomlessStr === i.customId) {
                            mapIndex = o;
                            break;
                        }
                    }
                    const listButtonNew = makeListButton(weeklytt);
                    let isShroomless = weeklytt[mapIndex].map.isShroomless ? "ni" : "item"
                    let currentMap = weeklytt[mapIndex].map.idMap+isShroomless
                    let responseEmbed = await weeklyEmbedMessage(weeklytt[mapIndex], currentMap);
                    messageReaction.edit({embeds : [responseEmbed], components: [listButtonNew] });
                
            });

            collectorButton.on('end', async i => {
                messageReaction.edit({components: [] });
            })
        }
        );
       

    } catch(error) { 
        console.log(error)
    }
    

}


const weeklyEmbedMessage = async (weeklytt) => {
    if(weeklytt.statusCode === 404) {
        return null;
    }

    const classementEmbed = makeEmbedMessage(weeklytt);
    return classementEmbed;

}

function makeFields(arrayTimes, floor) {
    const maxLength = arrayTimes.length ? Math.max(...(arrayTimes.map(el => el.name.length))) : 0;
    let fieldTitle = `${floor.nameFloor} : ${floor.timeFloor}`;
    let fieldText = "";
    arrayTimes.forEach(element => {
        const name = addBlank(element.name, maxLength, true);
        fieldText += `\`${name} : ${element.duration}\`\n`;
    });
    if(fieldText == "") {
        fieldText = '\u200b';
    }
    return {
        name: fieldTitle,
        value: fieldText,
        inline: true
    }
}

const makeEmbedMessage = (weeklytt) => {
    const title = `Weekly TT : ${weeklytt.map.initialGame} ${weeklytt.map.nameMap}`;
    const emote =  weeklytt.map.isShroomless ? ` <:no_mushroom_bot:1033130955470295131>` : ` <:mushroom_bot:1033128412405047356>`;
    const minia = weeklytt.map.minia;
    const colorEmbed = 0x1f8b4c;
    const isDLC = weeklytt.map.DLC ? "DLC" : "Not DLC";
    const isRetro = weeklytt.map.retro ? "Retro" : "Not retro";
    const idMap = weeklytt.map.idMap;
    const arrayFloor = [
        {
            nameFloor: "Gold",
            timeFloor: msToTime(weeklytt.map.goldTime)
        },
        {
            nameFloor: "Silver",
            timeFloor: msToTime(weeklytt.map.silverTime)
        },
        {
            nameFloor: "Bronze",
            timeFloor: msToTime(weeklytt.map.bronzeTime)
        },
        {
            nameFloor: "Iron",
            timeFloor: msToTime(weeklytt.map.ironTime)
        },
        {
            nameFloor: "Out",
            timeFloor: ""
        },
    ]

        let classementEmbed = new EmbedBuilder()
            .setColor(colorEmbed)
            .setFooter({text : `${idMap} - ${isDLC} - ${isRetro}`})
            .setThumbnail(minia)
            .setTitle(`${emote} ${title}`)
            .setTimestamp(Date.now()) 
            let index = 0;
            for(element in weeklytt.weeklyTimetrial) {
                let field = makeFields(weeklytt.weeklyTimetrial[element], arrayFloor[index]);
                classementEmbed.addFields(field);
                index++;
            }
            return classementEmbed;
            
            
}

const makeListButton = (arrayWeeklyMaps, currentMap) => {
    const arrayButtonStyle = [ButtonStyle.Primary, ButtonStyle.Secondary, ButtonStyle.Success, ButtonStyle.Danger];
    const row = new ActionRowBuilder()
        arrayWeeklyMaps.forEach((element, index) => {
            const shroomless = element.map.isShroomless ? "ni" : "item";
            const idMap = element.map.idMap;
            let i = index;
            while (i > arrayButtonStyle.length-1) {
                i - arrayButtonStyle.length;
            }
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`${idMap+shroomless}`)
                    .setLabel(`${idMap} - ${shroomless}`)
                    .setStyle(arrayButtonStyle[i])
                    .setDisabled((currentMap == idMap+shroomless))
            )
        })
        return row;
}

module.exports.config = {
    name: "weeklytt"
}
