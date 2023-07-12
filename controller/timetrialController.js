const { getAllPlayer } = require("../controller/apiController");
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder , ButtonStyle, ComponentType } = require('discord.js');
const { addBlank } = require("../fonctions");
const settings = require("../bdd/settings.json");

/**
 * 
 * @param {Discord.Client} bot 
 */

 const updateClassementTimetrial = async (bot, isMobile = false) => {
    const channel = await bot.channels.fetch(settings.channelRankings);
    const msg = await channel.messages.fetch(settings.rankingTimetrials);
    const file = new AttachmentBuilder("./image/LaYoshiFamily.png");

    let classement = await getAllPlayer();

    let embedMsg = makeEmbedMessage(classement, isMobile);
    const buttons = makeListButton(isMobile);

    msg.edit({content : "" ,embeds: [embedMsg], files: [file], components: [buttons]});
    
    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 86400000 });
        collector.on('collect', async i => { 
            if(i.customId === "viewMobile") {
                await i.deferUpdate();
                let embedMsg = makeEmbedMessage(classement, false);
                let newbuttons = makeListButton(false);
                msg.edit({content: "", embeds : [embedMsg], components: [newbuttons] });
                
            } else if(i.customId === "viewPC") {
                await i.deferUpdate();
                let embedMsg = makeEmbedMessage(classement, true);
                let newbuttons = makeListButton(true);
                msg.edit({content: "La vue Mobile n'affiche que le joueurs ayant 10 pts ou +", embeds : [embedMsg], components: [newbuttons] });
                return;
            }
        });
}

const makeEmbedMessage = (classement, isMobile) => {
    
    let maxLengthPts;
    if(isMobile) {
        let field = "";
        let maxLengthName = Math.max(...(classement.data.map(el => el.name.length)));
        classement.data.forEach((element, index) => {
            if(element.tt_points <= 10) {
                return;
            }
            element.name = addBlank(element.name, maxLengthName, true)
            element.tt_points += "";
            element.tt_top1 += "";
            element.tt_top3 += "";

            // set up the maxLength
            if(index == 0){
                maxLengthPts = element.tt_points.length;
            } else {
                element.tt_points = addBlank(element.tt_points, maxLengthPts)
            }

            element.tt_top1 = addBlank(element.tt_top1, 2)
            element.tt_top3 = addBlank(element.tt_top3, 2)

            let space = (index < 9) ? ` ` : ``;
            field += `\`${index+1}${space} : ${element.name}${element.tt_points}pts | ${element.tt_top1} - ${element.tt_top3}\`\n`;
            
        })
        console.log(field.length)

        let classementEmbed = new EmbedBuilder()
                .setColor(0x1f8b4c)
                .setAuthor({ name: `Classement Timetrial YF :`, iconURL: "attachment://LaYoshiFamily.png"})
                .addFields({name : `__Membre:       Points:         Top 1 & Top 3:__`, value : field, inline : true})
                .setFooter({text : "1er = 10 pts, 2nd = 9 pts, [...] 10ème = 1 pts"})
                .setTimestamp(Date.now());

        return classementEmbed;

    } else {
        
        let fieldName = "";
        let fieldPoints = "";
        let fieldTop = "";
        console.log(classement);
        classement.data.forEach((element, index) => {
            if(element.tt_points == 0) {
                return;
            }
            element.tt_points += ""
            element.tt_top1 += ""
            element.tt_top3 += ""
            if(index == 0){
                maxLengthPts = element.tt_points.length;
            } else {
                element.tt_points = addBlank(element.tt_points, maxLengthPts)
            }
            element.tt_top1 = addBlank(element.tt_top1, 2)
            element.tt_top3 = addBlank(element.tt_top3, 2)
            

            let space = (index < 9) ? ` ` : "";
            fieldName += `\`${index+1}${space} :\` **${element.name}** \n`;
            fieldPoints += `\`${element.tt_points} pts\`\n`;
            fieldTop += `\`${element.tt_top1}  -  ${element.tt_top3}\`\n`;
            
        })

        let classementEmbed = new EmbedBuilder()
                .setColor(0x1f8b4c)
                .setTitle(`----------------- Classement Timetrial YF -----------------`)
                .setThumbnail('attachment://LaYoshiFamily.png')
                .addFields({name : "__Membre:__", value : fieldName, inline : true})
                .addFields({name : "__Points:__", value : fieldPoints, inline : true})
                .addFields({name : "__Top 1 & Top 3:__", value : fieldTop, inline : true})
                .setFooter({text : "1er = 10 pts, 2nd = 9 pts, [...] 10ème = 1 pts"})
                .setTimestamp(Date.now());

        return classementEmbed;
        
    }
}

const makeListButton = (isMobile) => {
    const labelView = isMobile ? "Vue PC" : "Vue Mobile";
    const id = isMobile ? "viewMobile" : "viewPC"
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(id)
                .setLabel(labelView)
                .setStyle(ButtonStyle.Success)
        );
        return row;
}


module.exports = {
    updateClassementTimetrial
}