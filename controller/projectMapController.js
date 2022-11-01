const Discord = require('Discord.js');
const { getProjectMapByRoster } = require("../controller/apiController");
const { addBlank } = require("../fonctions");
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

/**
 * 
 * @param {Discord.Client} bot 
 */


const updateProjectMapRanking = async (bot, idRoster) => {
    const channel = await bot.channels.fetch('1034849902888497224');
    const msg = await channel.messages.fetch("1036753836754358402");
    const file = new AttachmentBuilder("./image/LaYoshiFamily.png");
    let iteration = 10;
    let month = 6;
    let isMobile = false;
    let showNoValidData = false;

    let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
    console.log(projectMap);
    let projectMapValidEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData);
    let buttons = makeListButton(isMobile, month, iteration, showNoValidData);

    const messageRecap = (idRoster, month, iteration, showNoValidData) => {
        let endMsg = showNoValidData ? "Affichage des données valides et non valides" : "Affichage des données valides uniquement"
        return `ProjectMap ${idRoster}, données des ${month} mois, données jugées valides à partir de ${iteration} itérations\n${endMsg}`
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
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "iteration-20") {
            iteration = 20;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
            return;
        }
        if (i.customId === "currentMonth-3") {
            month = 3;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "currentMonth-6") {
            month = 6;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "viewMobile") {
            isMobile = !isMobile;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "viewPC") {
            isMobile = !isMobile;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }
        if (i.customId === "showNotValid") {
            showNoValidData = !showNoValidData;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));   
        }
        if (i.customId === "dontShowNotValid") {
            showNoValidData = !showNoValidData;
            const listButtonNew = makeListButton(isMobile, month, iteration, showNoValidData);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, showNoValidData);
            await msg.edit({ embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            i.editReply(messageRecap(idRoster, month, iteration, showNoValidData));
        }

    });

    collectorButton.on('end', async i => {
        console.log("now");
        messageReaction.edit({ components: [] });
    })
}


const makeEmbedMessage = (projectMap, idRoster, isMobile, showNoValidData) => {

    if (projectMap.statusCode == 404) {
        if (isMobile) {
            let projectMapRank = new EmbedBuilder()
                .setColor(0x1f8b4c)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(` ProjectMap ${idRoster} `)
                .addFields({ name: `__**Données valides :**__`, value: `Aucune données valides`, inline: false })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());

            return projectMapRank;
        } else {
            let projectMapRank = new EmbedBuilder()
                .setColor(0x1f8b4c)
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
                .setColor(0x1f8b4c)
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
                .setColor(0x1f8b4c)
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
                console.log(element);
                element.score = addBlank(element.score, maxLengthScore)
                element.iteration = addBlank(element.iteration, maxLengthIteration);
                element.idMap = addBlank(element.idMap, maxLengthName, true);
                let space = (index < 9) ? ` ` : "";
                field += `\`${index + 1}${space} : ${element.idMap} | ${element.score} pts | ${element.iteration}\`\n`;
            }); 
            projectMapRank
                .setColor(0x1f8b4c)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(` ProjectMap ${idRoster} `)
                .addFields({ name: `.`, value: `__**Données valides :**__`, inline: false })
                .addFields({ name: `__Map :     Score :     Iteration :__`, value: field, inline: true })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());
        } else {
            projectMapRank
                .setColor(0x1f8b4c)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(` ProjectMap ${idRoster} `)
                .addFields({ name: `__**Données valides :**__`, value: `Aucune données valides`, inline: false })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());
        }

        if (showNoValidData) {
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
                    field += `\`${index + 1}${space} : ${element.idMap} | ${element.score} pts | ${element.iteration}\`\n`;
                });
                projectMapRank
                    .addFields({ name: `.`, value: `__**Données non-valides :**__`, inline: false })
                    .addFields({ name: `__Map :     Score :     Iteration :__`, value: field, inline: true })
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