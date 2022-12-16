const Discord = require('discord.js');
const { getProjectMapByRoster } = require("../controller/apiController");
const { addBlank } = require("../fonctions");
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const settings = require("../bdd/settings.json");
/**
 * 
 * @param {Discord.Client} bot 
 */


const updateProjectMapRanking = async (bot, idRoster) => {
    let idMsg = (idRoster === "YFG") ? settings.rankingYFG : settings.rankingYFO;
    const color = (idRoster === "YFG") ? 0x2ecc71 : 0x3498db;
    const channel = await bot.channels.fetch(settings.channelRankings);
    const msg = await channel.messages.fetch(idMsg);
    const file = new AttachmentBuilder("./image/LaYoshiFamily.png");
    let iteration = 10;
    let month = 6;
    let isMobile = false;
    let showNoValidData = false;

    let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
    let projectMapValidEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData, color);
    let buttons = makeListButton(isMobile, month, iteration, showNoValidData);

    const messageRecap = (idRoster, month, iteration, showNoValidData) => {
        let saut2ligne = ".\n\n\n";
        let endMsg = showNoValidData ? "Affichage des données valides et non valides" : "Affichage des données valides uniquement"
        return `${saut2ligne}**ProjectMap ${idRoster} : ** données des ${month} mois, données jugées valides à partir de ${iteration} itérations\n${endMsg}`
    }

    msg.edit({ content: messageRecap(idRoster, month, iteration, showNoValidData), embeds: [projectMapValidEmbed], files: [file], components: [buttons] });
    const filter = i => {
        i.deferUpdate();
        return true
    };
    const collectorButton = msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 86400000 });

    
    collectorButton.on('collect', async i => {

        if (i.customId === "iteration-10") {
            iteration = 10;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData, color);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "iteration-20") {
            iteration = 20;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData, color);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
            return;
        }
        if (i.customId === "currentMonth-3") {
            month = 3;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData, color);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "currentMonth-6") {
            month = 6;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData, color);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "viewMobile") {
            isMobile = !isMobile;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData, color);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "viewPC") {
            isMobile = !isMobile;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData, color);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "showNotValid") {
            showNoValidData = !showNoValidData;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData, color);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));   
        }
        if (i.customId === "dontShowNotValid") {
            showNoValidData = !showNoValidData;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData, color);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }

    });

    // Delete buttons from the message
    collectorButton.on('end', async i => {
        messageReaction.edit({ components: [] });
    })
}


const makeEmbedMessage = (projectMap, idRoster, isMobile, showNoValidData, color) => {

    if (projectMap.statusCode == 404) {
        if (isMobile) {
            let projectMapRank = new EmbedBuilder()
                .setColor(color)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(` ProjectMap ${idRoster} `)
                .addFields({ name: `__**Données valides :**__`, value: `Aucune données valides`, inline: false })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());

            return projectMapRank;
        } else {
            let projectMapRank = new EmbedBuilder()
                .setColor(color)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(`----------------- ProjectMap ${idRoster} -----------------`)
                .addFields({ name: `__**Données valides :**__`, value: `Aucune données valides`, inline: false })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());

            return projectMapRank;
        }

    }

    let projectMapRanking = projectMap.data;
    if (!isMobile) {
        let idMapField = "";
        let scoreField = "";
        let iterationField = "";
        
        let projectMapRank = new EmbedBuilder()
        if (projectMapRanking.projectMapValid != null) {
            let maxLengthScore = Math.max(...(projectMapRanking.projectMapValid.map(el => {
                // transform score into string to get length
                el.score += "";
                return el.score.length
            })));
            let maxLengthIteration = Math.max(...(projectMapRanking.projectMapValid.map(el => {
                // transform score into string to get length
                el.iteration += "";
                return el.iteration.length
            })));

            projectMapRanking.projectMapValid.forEach((element, index) => {
                element.score = addBlank(element.score, maxLengthScore)
                element.iteration = addBlank(element.iteration, maxLengthIteration);
                let space = (index < 9) ? ` ` : "";
                idMapField += `\`${index + 1}${space} : \` **${element.idMap}** \n`;
                scoreField += `\`${element.score} pts\`\n`;
                iterationField += `\`${element.iteration}\`\n`;
            });

            projectMapRank
                .setColor(color)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(`----------------- ProjectMap ${idRoster} -----------------`)
                .addFields({ name: `.`, value: `__**Données valides :**__`, inline: false })
                .addFields({ name: `__Map :__`, value: idMapField, inline: true })
                .addFields({ name: `__Score :__`, value: scoreField, inline: true })
                .addFields({ name: `__Iteration :__`, value: iterationField, inline: true })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());
        } else {
            projectMapRank
                .setColor(color)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(`----------------- ProjectMap ${idRoster} -----------------`)
                .addFields({ name: `__**Données valides :**__`, value: `Aucune données valides`, inline: false })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());
        }

        if (showNoValidData) {
            let idMapField2 = "";
            let scoreField2 = "";
            let iterationField2 = "";
            
            if (projectMapRanking.projectMapNotValid != null) {
                let maxLengthScore = Math.max(...(projectMapRanking.projectMapNotValid.map(el => {
                    // transform score into string to get length
                    el.score += "";
                    return el.score.length
                })));
                let maxLengthIteration = Math.max(...(projectMapRanking.projectMapNotValid.map(el => {
                    // transform score into string to get length
                    el.iteration += "";
                    return el.iteration.length
                })));

                projectMapRanking.projectMapNotValid.forEach((element, index) => {
                    element.score = addBlank(element.score, maxLengthScore);
                    element.iteration = addBlank(element.iteration, maxLengthIteration);
                    let space = (index < 9) ? ` ` : "";
                    idMapField2 += `\`${index + 1}${space} : \` **${element.idMap}** \n`;
                    scoreField2 += `\`${element.score} pts\`\n`;
                    iterationField2 += `\`${element.iteration}\`\n`;
                })
                projectMapRank
                    .addFields({ name: `.`, value: `__**Données non-valides :**__`, inline: false })
                    .addFields({ name: `__Map :__`, value: idMapField2, inline: true })
                    .addFields({ name: `__Score :__`, value: scoreField2, inline: true })
                    .addFields({ name: `__Iteration :__`, value: iterationField2, inline: true })
            } else {
                projectMapRank
                    .addFields({ name: `__**Données non-valides :**__`, value: `Aucune données non-valides`, inline: false })
            }
        }
        return projectMapRank;

    } else {
        let arrayFields = [];
        let field = "";
        let projectMapRank = new EmbedBuilder()
        
        
        if(projectMapRanking.projectMapValid != null) {
            let maxLengthScore = Math.max(...(projectMapRanking.projectMapValid.map(el => {
                // transform score into string to get length
                el.score += "";
                return el.score.length
            })));
            let maxLengthIteration = Math.max(...(projectMapRanking.projectMapValid.map(el => {
                // transform score into string to get length
                el.iteration += "";
                return el.iteration.length
            })));
            let maxLengthName = Math.max(...(projectMapRanking.projectMapValid.map(el => el.idMap.length)));
            projectMapRanking.projectMapValid.forEach((element, index) => {
                
                element.score = addBlank(element.score, maxLengthScore)
                element.iteration = addBlank(element.iteration, maxLengthIteration);
                element.idMap = addBlank(element.idMap, maxLengthName, true);
                let space = (index < 9) ? ` ` : "";
                // a field canno't have more than 1024 character
                if(field.length > 900) {
                    arrayFields.push(field);
                    field = "";
                }
                field += `\`${index + 1}${space} : ${element.idMap} | ${element.score} pts | ${element.iteration}\`\n`;
            }); 
            if(field.length > 0) {
                arrayFields.push(field);
                    field = "";
            }
            projectMapRank
                .setColor(color)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(` ProjectMap ${idRoster} `)
                .addFields({ name: `.`, value: `__**Données valides :**__`, inline: false })
                arrayFields.forEach(elt => {
                    projectMapRank.addFields({ name: `__Map :     Score :     Iteration :__`, value: elt, inline: true })
                })
            projectMapRank
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());
        } else {
            projectMapRank
                .setColor(color)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(` ProjectMap ${idRoster} `)
                .addFields({ name: `__**Données valides :**__`, value: `Aucune données valides`, inline: false })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());
        }

        if (showNoValidData) {
            let arrayFields = [];
            let field = "";

            if(projectMapRanking.projectMapNotValid != null) {
                let maxLengthScore = Math.max(...(projectMapRanking.projectMapNotValid.map(el => {
                    // transform score into string to get length
                    el.score += "";
                    return el.score.length
                })));
                let maxLengthIteration = Math.max(...(projectMapRanking.projectMapNotValid.map(el => {
                    // transform score into string to get length
                    el.iteration += "";
                    return el.iteration.length
                })));
                let maxLengthName = Math.max(...(projectMapRanking.projectMapNotValid.map(el => el.idMap.length)));
                projectMapRanking.projectMapNotValid.forEach((element, index) => {
                    element.score = addBlank(element.score, maxLengthScore)
                    element.iteration = addBlank(element.iteration, maxLengthIteration);
                    element.idMap = addBlank(element.idMap, maxLengthName, true);
                    let space = (index < 9) ? ` ` : "";

                    // a field canno't have more than 1024 character
                    if(field.length > 900) {
                        arrayFields.push(field);
                        field = "";
                    }
                    field += `\`${index + 1}${space} : ${element.idMap} | ${element.score} pts | ${element.iteration}\`\n`;
                });
                if(field.length > 0) {
                    arrayFields.push(field);
                        field = "";
                }
                projectMapRank
                    .addFields({ name: `.`, value: `__**Données non-valides :**__`, inline: false })
                    arrayFields.forEach(elt => {
                        projectMapRank.addFields({ name: `__Map :     Score :     Iteration :__`, value: elt, inline: true })
                    })
            } else {
                projectMapRank
                .addFields({ name: `__**Données non-valides :**__`, value: `Aucune données non-valides`, inline: false })
            }   
        }
        return projectMapRank;
    }
}

const makeListButton = (isMobile, currentMonth, currentIteration, showNoValidData) => {
    const labelView = isMobile ? "Vue PC" : "Vue Mobile";
    const idMobile = isMobile ? "viewMobile" : "viewPC";
    const emoji = isMobile ? "💻" : "📱";
    const idIteration = (currentIteration == 10) ? "iteration-20" : "iteration-10";
    const labelIteration = (currentIteration == 10) ? "Voir 20 iteration" : "Voir 10 iteration";

    const idMonth = (currentMonth == 6) ? "currentMonth-3" : "currentMonth-6";
    const labelmonth = (currentMonth == 6) ? "Voir sur 3 mois" : "Voir sur 6 mois";

    const labelData = showNoValidData ? "W/O données non-valides" : "W/ données non-valides";
    const idData = showNoValidData ? "showNotValid" : "dontShowNotValid";

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(idIteration)
                .setLabel(labelIteration)
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(idMonth)
                .setLabel(labelmonth)
                .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(idMobile)
                .setLabel(labelView)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(emoji)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(idData)
                .setLabel(labelData)
                .setStyle(ButtonStyle.Danger)
                .setEmoji(emoji)
        );
    return row;
}

module.exports = {
    updateProjectMapRanking
}