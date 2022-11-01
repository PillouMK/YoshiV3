const Discord = require('discord.js');
const fs = require('fs');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType  } = require('discord.js');

const { getTimetrialsByMap } = require("../controller/apiController");
const { max } = require('moment/moment');

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    const idMap = args[1]; 
    let isShroomless = false;
    let isMobile = false;
    let idRoster = undefined;
    let idRosterForDisabled;
    let idUser = message.author.id;

    const listButton = makeListButton(isShroomless, isMobile, "YF");
    let responseEmbed = await timetrialEmbedMessage(idMap, false, isShroomless, idUser);
    
    if(responseEmbed.statusCode != undefined && responseEmbed.statusCode != 200) {
        message.channel.send({ content : responseEmbed.data.error})
        return;
    }
    
    try {
        message.channel.send({embeds : [responseEmbed], components: [listButton]}).then((messageReaction) => {
            
            const collectorButton = messageReaction.createMessageComponentCollector({ componentType: ComponentType.Button, time: 900000 });

            collectorButton.on('collect', async i => { 
                if(i.customId === "YFG") {
                    idRoster = "YFG";
                    idRosterForDisabled = "YFG";
                    const listButtonNew = makeListButton(isShroomless, isMobile, idRosterForDisabled);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless, idUser, idRoster);
                    messageReaction.edit({embeds : [responseEmbed], components: [listButtonNew] });
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                if(i.customId === "YFO") {
                    idRoster = "YFO";
                    idRosterForDisabled = "YFO";
                    const listButtonNew = makeListButton(isShroomless, isMobile, idRosterForDisabled);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless, idUser, idRoster);
                    messageReaction.edit({embeds : [responseEmbed], components: [listButtonNew] });
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                if(i.customId === "YF") {
                    idRoster = undefined;
                    idRosterForDisabled = "YF";
                    const listButtonNew = makeListButton(isShroomless, isMobile, idRosterForDisabled);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless, idUser);
                    messageReaction.edit({embeds : [responseEmbed], components: [listButtonNew] });
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                if(i.customId === "shroomless") {
                    isShroomless = !isShroomless;
                    const listButtonNew = makeListButton(isShroomless, isMobile, idRosterForDisabled);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless, idUser, idRoster);
                    messageReaction.edit({embeds: [responseEmbed], components: [listButtonNew]});
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                if(i.customId === "view") {
                    isMobile = !isMobile;
                    const listButtonNew = makeListButton(isShroomless, isMobile, idRosterForDisabled);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless, idUser, idRoster);
                    messageReaction.edit({embeds: [responseEmbed], components: [listButtonNew]});
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                    
            });

            collectorButton.on('end', async i => {
                console.log("now");
                messageReaction.edit({components: [] });
            })
        }
        );
       

    } catch(error) { 
        console.log(error)
    }
    

}


const timetrialEmbedMessage = async (idMap, isMobile, isShroomless, idUser, idRoster = undefined) => {
    let timetrials = await getTimetrialsByMap(idMap, idRoster);

    if(timetrials.statusCode === 404) {
        return timetrials;
    }
  
    const infoMap = timetrials.data.infoMap;
    
    const timetrialsArray = isShroomless ? timetrials.data.timetrials.arrayShroomless : timetrials.data.timetrials.arrayShroom

    // word for classement
    const terminaison = ["st", "nd", "rd", "th"];

    // array of fields of embedMessage
    let fields;

    if(timetrialsArray == null) {
        const classementEmbed = makeEmbedMessage(infoMap, undefined, undefined, idRoster, isMobile, isShroomless, true);
        return classementEmbed;
    }

    const date = new Date(Math.max(...timetrialsArray.map(e => Date.parse(e.date))));
    let indexUser = timetrialsArray.findIndex(x => x.idPlayer === idUser);
    
    if(!isMobile) {
        let nameClassement = "";
        let timeClassement = "";
        let timeDifference = "";

        timetrialsArray.forEach((element, index) => {
            if(index < 10) {
                let place = ((index+1) < 4) ? terminaison[index] : terminaison[3];
                let placement = index < 9 ? `\`${index+1}${place}.\`` : `\`${index+1}${place}\``;
                nameClassement += `${placement} : **${element.name}**\n`;
                timeClassement += `\`${element.duration}\`\n`;
                timeDifference += `\`(${element.difference})\`\n`; 
            }
        });

        if(indexUser != -1 && indexUser >= 10) {
            let element = timetrialsArray[indexUser];
            let place = terminaison[3];
            let placement = indexUser < 9 ? `\`${indexUser+1}${place}.\`` : `\`${indexUser+1}${place}\``;
            nameClassement += `${placement} : **${element.name}**\n`;
            timeClassement += `\`${element.duration}\`\n`;
            timeDifference += `\`(${element.difference})\`\n`; 
        }
        fields = [nameClassement, timeClassement, timeDifference];

    } else {
        let allClassement = "";
        let maxLength = Math.max(...(timetrialsArray.map(el => el.name.length)));

        timetrialsArray.forEach((element, index) => {
            element.duration = element.duration.slice(1);
            if(index < 10) {
                element.name = addBlank(element.name, maxLength)
                
                let place = ((index+1) < 4) ? terminaison[index] : terminaison[3];
                let placement = index < 9 ? `${index+1}${place} ` : `${index+1}${place}`;
                allClassement += `\`${placement} ${element.name} ${element.duration} (${element.difference})\` \n`;
            }   
        });

        if(indexUser != -1 && indexUser >= 10) {
            let element = timetrialsArray[indexUser];
            element.name = addBlank(element.name, maxLength)
            let place = terminaison[3];
            let placement = indexUser < 9 ? `${indexUser+1}${place} ` : `${indexUser+1}${place}`;
            allClassement += `\`${placement} ${element.name} ${element.duration} (${element.difference})\` \n`;
        }
        fields = [allClassement];
    }

    const classementEmbed = makeEmbedMessage(infoMap, fields, date, idRoster, isMobile, isShroomless, false);
    return classementEmbed;

}

const rosterColor = (idRoster) => {
    let color;
    switch(idRoster) {         
        case "YFG" :
            color = 0x2ecc71;
            break;
        case "YFO" :
            color = 0x3498db;
            break;
        default: 
            color = 0x1f8b4c;
            break;
    }
    return color;
}

const addBlank = (name, maxLength) => {
    while(name.length < maxLength + 1) {
        name += ` `;
    }
    name += `:`;
    return name;
}

const makeEmbedMessage = (infoMap, fields, date, idRoster, isMobile, isShroomless, isNull) => {
    let title = `Classement : ${infoMap.initialGame} ${infoMap.nameMap}`;
    let emote =  isShroomless ? ` <:no_mushroom_bot:1033130955470295131>` : ` <:mushroom_bot:1033128412405047356>`;
    const colorEmbed = rosterColor(idRoster);
    const isDLC = infoMap.DLC ? "DLC" : "Not DLC";
    const isRetro = infoMap.retro ? "Retro" : "Not retro";
    const quoteShroomless = isShroomless ? "shroomless" : "items";
    const quoteRoster = (idRoster != undefined) ? `pour le roster ${idRoster}` : "";
    if(isNull) {
        return classementEmbed = new EmbedBuilder()
            .setColor(0xec1c24)
            .setTitle(`${title} ${emote}`)
            .setFooter({text : `${infoMap.idMap} - ${isDLC} - ${isRetro}`}) 
            .setThumbnail(infoMap.minia)
            .addFields({name : "__Erreur:__", value : `Il n'y a pas de temps sur ${infoMap.nameMap} en ${quoteShroomless} ${quoteRoster}`, inline : true})
    }
    if(!isMobile) {
        return classementEmbed = new EmbedBuilder()
            .setColor(colorEmbed)
            .setTitle(`${emote} ${title}`)
            .setFooter({text : `${infoMap.idMap} - ${isDLC} - ${isRetro}`})
            .setThumbnail(infoMap.minia)
            .addFields({name : "__Membre:__", value : fields[0], inline : true})
            .addFields({name : "__Time:__", value : fields[1], inline : true})
            .addFields({name : "__Diff:__", value : fields[2], inline : true})
            .setTimestamp(date)
    } else {
        return classementEmbed = new EmbedBuilder()
            .setColor(colorEmbed)
            .setFooter({text : `${infoMap.idMap} - ${isDLC} - ${isRetro}`})
            .setAuthor({ name: title, iconURL: infoMap.minia})
            .addFields({name : `__Membre:       Time:       Diff:__ ${emote}`, value : fields[0], inline : true})
            .setTimestamp(date)
    }

    
}

const makeListButton = (isShroomless, isMobile, idRoster) => {
    const labelView = isMobile ? "PC" : "Mobile";
    const emoji = isMobile ? "💻" : "📱";
    const itemLabel = !isShroomless ? "Shroomless" : "With items"
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`YF`)
                .setLabel('Yoshi')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled((idRoster == "YF") ? true : false),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`YFG`)
                .setLabel('Galaxy')
                .setStyle(ButtonStyle.Success)
                .setDisabled((idRoster == "YFG") ? true : false),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`YFO`)
                .setLabel('Odyssey')
                .setStyle(ButtonStyle.Primary)
                .setDisabled((idRoster == "YFO") ? true : false),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`shroomless`)
                .setLabel(itemLabel)
                .setStyle(ButtonStyle.Danger)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`view`)
                .setLabel(labelView)
                .setEmoji(emoji)
                .setStyle(ButtonStyle.Secondary)
        );
        return row;
}

module.exports.config = {
    name: "classement"
}
