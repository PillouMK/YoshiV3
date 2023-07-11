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
    let projectMapValidEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, color);
    let buttons = makeListButton(isMobile, month, iteration);

    const messageRecap = (idRoster, month, iteration) => {
        let saut2ligne = ".\n\n\n";
        let endMsg = "Affichage des données valides et non valides";
        return `${saut2ligne}**ProjectMap ${idRoster} : ** données des ${month} mois, données jugées valides à partir de ${iteration} itérations\n${endMsg}`
    }

    msg.edit({ content: messageRecap(idRoster, month, iteration), embeds: [projectMapValidEmbed], files: [file], components: [buttons] });
    
    const collectorButton = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 86400000 });

    
    collectorButton.on('collect', async i => {

        if (i.customId === "iteration-10") {
            await i.deferUpdate();
            iteration = 10;
            const listButtonNew = makeListButton(isMobile, month, iteration);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, color);
            await msg.edit({content: messageRecap(idRoster, month, iteration), embeds: [responseEmbed], components: [listButtonNew], files: [file] });
        }
        if (i.customId === "iteration-20") {
            await i.deferUpdate();
            iteration = 20;
            const listButtonNew = makeListButton(isMobile, month, iteration);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, color);
            await msg.edit({content: messageRecap(idRoster, month, iteration), embeds: [responseEmbed], components: [listButtonNew], files: [file] });
            return;
        }
        if (i.customId === "currentMonth-3") {
            await i.deferUpdate();
            month = 3;
            const listButtonNew = makeListButton(isMobile, month, iteration);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, color);
            await msg.edit({content: messageRecap(idRoster, month, iteration), embeds: [responseEmbed], components: [listButtonNew], files: [file] });
        }
        if (i.customId === "currentMonth-6") {
            await i.deferUpdate();
            month = 6;
            const listButtonNew = makeListButton(isMobile, month, iteration);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, color);
            await msg.edit({content: messageRecap(idRoster, month, iteration), embeds: [responseEmbed], components: [listButtonNew], files: [file] });
        }
        if (i.customId === "viewMobile") {
            await i.deferUpdate();
            isMobile = !isMobile;
            const listButtonNew = makeListButton(isMobile, month, iteration);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, color);
            await msg.edit({content: messageRecap(idRoster, month, iteration), embeds: [responseEmbed], components: [listButtonNew], files: [file] });
        }
        if (i.customId === "viewPC") {
            await i.deferUpdate();
            isMobile = !isMobile;
            const listButtonNew = makeListButton(isMobile, month, iteration);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, color);
            await msg.edit({content: messageRecap(idRoster, month, iteration), embeds: [responseEmbed], components: [listButtonNew], files: [file] });
        }
        if (i.customId === "showNotValid") {
            await i.deferUpdate();
            const listButtonNew = makeListButton(isMobile, month, iteration);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, color);
            await msg.edit({content: messageRecap(idRoster, month, iteration), embeds: [responseEmbed], components: [listButtonNew], files: [file] });   
        }
        if (i.customId === "dontShowNotValid") {
            await i.deferUpdate();
            const listButtonNew = makeListButton(isMobile, month, iteration);
            let projectMap = await getProjectMapByRoster(idRoster, month, iteration);
            let responseEmbed = makeEmbedMessage(projectMap, idRoster, isMobile, color);
            await msg.edit({content: messageRecap(idRoster, month, iteration), embeds: [responseEmbed], components: [listButtonNew], files: [file] });
        }

    });

    // Delete buttons from the message
    collectorButton.on('end', async i => {
        messageReaction.edit({ components: [] });
    })
}


const makeEmbedMessage = (projectMap, idRoster, isMobile, color) => {

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

    if(idRoster == "YFG") console.log(idRoster, projectMap.data);
    let projectMapRanking = projectMap.data;
    if (!isMobile) {
        let fieldsArray = [];
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

                if(idMapField.length > 1000) {
                    fieldsArray.push(
                        { name: `__Map :__`, value: idMapField, inline: true },
                        { name: `__Score :__`, value: scoreField, inline: true },
                        { name: `__Iteration :__`, value: iterationField, inline: true }
                    );
                    idMapField = "";
                    scoreField = "";
                    iterationField = "";
                }
            });

            fieldsArray.push(
                { name: `__Map :__`, value: idMapField, inline: true },
                { name: `__Score :__`, value: scoreField, inline: true },
                { name: `__Iteration :__`, value: iterationField, inline: true }
            );

    
            projectMapRank
                .setColor(color)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(`----------------- ProjectMap ${idRoster} -----------------`)
                .addFields({ name: `.`, value: `__**Données valides :**__`, inline: false })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());

            fieldsArray.forEach(elt => {
                projectMapRank.addFields(elt)
            });
                
        } else {
            projectMapRank
                .setColor(color)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .setTitle(`----------------- ProjectMap ${idRoster} -----------------`)
                .addFields({ name: `__**Données valides :**__`, value: `Aucune données valides`, inline: false })
                .setFooter({ text: `project Map ${idRoster}` })
                .setTimestamp(Date.now());
        }
        let fieldsArray2 = []
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

                if(idMapField.length > 1000) {
                    fieldsArray2.push(
                        { name: `__Map :__`, value: idMapField2, inline: true },
                        { name: `__Score :__`, value: scoreField2, inline: true },
                        { name: `__Iteration :__`, value: iterationField2, inline: true }
                    );
                    idMapField2 = "";
                    scoreField2 = "";
                    iterationField2 = "";
                }
            });
            fieldsArray2.push(
                { name: `__Map :__`, value: idMapField2, inline: true },
                { name: `__Score :__`, value: scoreField2, inline: true },
                { name: `__Iteration :__`, value: iterationField2, inline: true }
            );

            projectMapRank
                .addFields({ name: `.`, value: `__**Données non-valides :**__`, inline: false })
                fieldsArray2.forEach(elt => {
                    projectMapRank.addFields(elt)
                });
        } else {
            projectMapRank
                .addFields({ name: `__**Données non-valides :**__`, value: `Aucune données non-valides`, inline: false })
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
                    projectMapRank.addFields({ name: `__Map :     Score :     Iteration :__`, value: elt, inline: false })
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

        arrayFields = [];
        field = "";

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
                    projectMapRank.addFields({ name: `__Map :     Score :     Iteration :__`, value: elt, inline: false })
                })
        } else {
            projectMapRank
            .addFields({ name: `__**Données non-valides :**__`, value: `Aucune données non-valides`, inline: false })
        }   
        return projectMapRank;
    }
}

const makeListButton = (isMobile, currentMonth, currentIteration) => {
    const labelView = isMobile ? "Vue PC" : "Vue Mobile";
    const idMobile = isMobile ? "viewMobile" : "viewPC";
    const emoji = isMobile ? "💻" : "📱";
    const idIteration = (currentIteration == 10) ? "iteration-20" : "iteration-10";
    const labelIteration = (currentIteration == 10) ? "Voir 20 iteration" : "Voir 10 iteration";

    const idMonth = (currentMonth == 6) ? "currentMonth-3" : "currentMonth-6";
    const labelmonth = (currentMonth == 6) ? "Voir sur 3 mois" : "Voir sur 6 mois";

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
    return row;
}

module.exports = {
    updateProjectMapRanking
}