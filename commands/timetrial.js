const Discord = require('discord.js');
const fs = require('fs');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType  } = require('discord.js');

const { getTimetrialsByMap } = require("../controller/apiController");

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

    const listButton = makeListButton(isShroomless, isMobile);
    let responseEmbed = await timetrialEmbedMessage(idMap, false, isShroomless);
    
    if(responseEmbed.statusCode != undefined && responseEmbed.statusCode != 200) {
        message.channel.send({ content : responseEmbed.data.error})
        return;
    }
    /*
    let indexUser = classement.findIndex(x => x.idPlayer === message.author.id);
    let fieldUser = {};
    */
    try {
        message.channel.send({embeds : [responseEmbed], components: [listButton]}).then((messageReaction) => {
            
            const collectorButton = messageReaction.createMessageComponentCollector({ componentType: ComponentType.Button, time: 900000 });

            collectorButton.on('collect', async i => { 
                if(i.customId === "YFG") {
                    idRoster = "YFG";
                    const listButtonNew = makeListButton(isShroomless, isMobile);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless, idRoster);
                    messageReaction.edit({embeds : [responseEmbed], components: [listButtonNew] });
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                if(i.customId === "YFO") {
                    idRoster = "YFO";
                    const listButtonNew = makeListButton(isShroomless, isMobile);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless, idRoster);
                    messageReaction.edit({embeds : [responseEmbed], components: [listButtonNew] });
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                if(i.customId === "YF") {
                    idRoster = undefined;
                    const listButtonNew = makeListButton(isShroomless, isMobile);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless);
                    messageReaction.edit({embeds : [responseEmbed], components: [listButtonNew] });
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                if(i.customId === "shroomless") {
                    isShroomless = !isShroomless;
                    const listButtonNew = makeListButton(isShroomless, isMobile);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless, idRoster);
                    messageReaction.edit({embeds: [responseEmbed], components: [listButtonNew]});
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                if(i.customId === "view") {
                    isMobile = !isMobile;
                    const listButtonNew = makeListButton(isShroomless, isMobile);
                    let responseEmbed = await timetrialEmbedMessage(idMap, isMobile, isShroomless, idRoster);
                    messageReaction.edit({embeds: [responseEmbed], components: [listButtonNew]});
                    i.reply("ok");
                    i.deleteReply();
                    return;
                }
                    
            });
        }
        );
       

    } catch(error) { 
        console.log(error)
    }
    

}


const timetrialEmbedMessage = async (idMap, isMobile, isShroomless, idRoster = undefined) => {
    let timetrials = await getTimetrialsByMap(idMap, idRoster);

    if(timetrials.statusCode === 404) {
        return timetrials;
    }

    const infoMap = timetrials.data.infoMap;
    const timetrialsArray = isShroomless ? timetrials.data.timetrials.arrayShroomless : timetrials.data.timetrials.arrayShroom
    const isDLC = infoMap.DLC ? "DLC" : "Not DLC";
    const isRetro = infoMap.retro ? "Retro" : "Not retro";
    const terminaison = ["st", "nd", "rd", "th"];

    if(timetrialsArray == null) {
        let quoteShroomless = isShroomless ? "shroomless" : "items";
        let quoteRoster = (idRoster != undefined) ? `pour le roster ${idRoster}` : "";
        const classementEmbed = new EmbedBuilder()
        .setColor(3066993)
        .setTitle(`Classement : ${infoMap.initialGame} ${infoMap.nameMap}`)
        .setFooter({text : `${infoMap.idMap} - ${isDLC} - ${isRetro}`})
        .setThumbnail(infoMap.minia)
        .addFields({name : "__Error:__", value : `Il n'y a pas de temps sur ${infoMap.nameMap} en ${quoteShroomless} ${quoteRoster}`, inline : true})

        return classementEmbed;
    }

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

        const classementEmbed = new EmbedBuilder()
        .setColor(3066993)
        .setTitle(`Classement : ${infoMap.initialGame} ${infoMap.nameMap}`)
        .setFooter({text : `${infoMap.idMap} - ${isDLC} - ${isRetro}`})
        .setThumbnail(infoMap.minia)
        .addFields({name : "__Membre:__", value : nameClassement, inline : true})
        .addFields({name : "__Time:__", value : timeClassement, inline : true})
        .addFields({name : "__Diff:__", value : timeDifference, inline : true})
        // .addFields({name : "---", value : `${fieldUser.name} ${fieldUser.value}`,inline :  false});

        return classementEmbed;
    } else {
        let allClassement = "";
        timetrialsArray.forEach((element, index) => {
            element.duration = element.duration.slice(1);
            if(index < 10) {
                /*
                let place = ((index+1) < 4) ? terminaison[index] : terminaison[3];
                let placement = index < 9 ? `\`${index+1}${place}.\`` : `\`${index+1}${place}\``;
                allClassement += `${placement} : **${element.name}**\n\`${element.duration}\` \`(${element.difference})\`\n`;
                */
               
                element.name.length += "   :";
               
                let place = "";
                let placement = index < 9 ? `${index+1}${place}.` : `${index+1}${place}`;
                allClassement += `${placement} : ${element.name} ${element.duration} (${element.difference}) \n`;
                // timeDifference += `\`${element.difference}\`\n`; 
            }   
        });

        const classementEmbed = new EmbedBuilder()
        .setColor(3066993)
        .setTitle(`Classement : ${infoMap.initialGame} ${infoMap.nameMap}`)
        .setFooter({text : `${infoMap.idMap} - ${infoMap.DLC} - ${infoMap.retro}`})
        //.setThumbnail(infoMap.minia)
        .addFields({name : "__Membre:    Time:   Diff:__", value : `\`\`\`${allClassement}\`\`\``, inline : true})

        return classementEmbed;
    }

}

const makeListButton = (isShroomless, isMobile) => {
    const labelView = isMobile ? "PC" : "Mobile";
    const emoji = isMobile ? "💻" : "📱";
    const itemLabel = !isShroomless ? "Shroomless" : "With items"
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`YF`)
                .setLabel('Yoshi')
                .setStyle(ButtonStyle.Secondary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`YFG`)
                .setLabel('Galaxy')
                .setStyle(ButtonStyle.Success),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`YFO`)
                .setLabel('Odyssey')
                .setStyle(ButtonStyle.Primary),
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
                .setStyle(ButtonStyle.Secondary),
        );
        return row;
}

module.exports.config = {
    name: "classement"
}
