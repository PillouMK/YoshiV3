// require Librairies
const Discord = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType  } = require('discord.js');



// require BDD
const bdd_lineupRequire = require("../bdd/lineup.json");
const bdd_lineup = bdd_lineupRequire.lineUp;
const settings = require("../bdd/settings.json");

// require classes
const { adaptHour } = require('../fonctions');

// Regex pattern
const numberTest = /(0[\d]{1})|(1[\d]{1})|(2[0-3]{1})/;

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @param {User} membreObject
 */

module.exports.run = async (bot, message, args) =>
{
    let memberCan;
    let memberMaybe;
    let horaireList = [];
    let mix = false;
    const guild = await bot.guilds.fetch("135721923568074753");

    // Remplissage de la liste d'horaire
    for(element in args){
        //Ti_C décalage
        if(numberTest.test(args[element]) && args[element].length == 2 && message.author.id === "156445194861019136") {
                args[element] = (parseInt(args[element]) + 1).toString()
            }
        if(numberTest.test(args[element]) && args[element].length == 2){   
            horaireList.push(args[element]);
        }
    }

    // Si aucun horaire valide
    if(horaireList.length == 0) {
        message.reply("Aucun horaire valide");
        return;
    }
   
        
    horaireList.forEach(async (horaire) => {
        
        let timeStamp = adaptHour(horaire, settings.decalageHoraire);
    
        if(bdd_lineup[horaire])
        {     
            if(bdd_lineup[horaire]["lu"].length == 0) {
            	message.channel.send({
                    content : `pas de lu pour <t:${timeStamp}:t>`
                });
                return;
        	}
            const lineUp = await makeLineUpEmbed(bdd_lineup[horaire]["lu"], mix, guild, timeStamp)
            const listButtonNew = makeListButton(mix);
            message.channel.send({embeds : [lineUp], components : [listButtonNew]}).then((messageButton) => {
                const collectorButton = messageButton.createMessageComponentCollector({ componentType: ComponentType.Button, time: 3600000 });
                collectorButton.on('collect', async i => { 
                    if(i.customId === "roster") {
                        let newMix = false;
                        const listButtonNew = makeListButton(newMix);
                        let lineUp = await makeLineUpEmbed(bdd_lineup[horaire]["lu"], newMix, guild, timeStamp)
                        messageButton.edit({embeds : [lineUp], components: [listButtonNew] });
                        i.reply("ok");
                        i.deleteReply();
                        return;
                    }
                    if(i.customId === "mix") {
                        let newMix = true;
                        const listButtonNew = makeListButton(newMix);
                        let lineUp = await makeLineUpEmbed(bdd_lineup[horaire]["lu"], newMix, guild, timeStamp)
                        messageButton.edit({embeds : [lineUp], components: [listButtonNew] });
                        i.reply("ok");
                        i.deleteReply();
                        return;
                    }
                });

                collectorButton.on('end', async i => {
                    let newMix = false;
                    let lineUp = await makeLineUpEmbed(bdd_lineup[horaire]["lu"], newMix, guild, timeStamp)
                    messageButton.edit({embeds : [lineUp], components: [] });
                })
            });
        } 
        else message.channel.send({
            content : `pas de lu pour <t:${timeStamp}:t>`
        });
    })
    message.delete();

}

const makeListButton = (isMix) => {
    const labelView = isMix ? "Voir line up roster" : "Voir line up mixte";
    const idView = isMix ? "roster" : "mix";
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(idView)
                .setLabel(labelView)
                .setStyle(ButtonStyle.Success)
        );
        return row;
}

const makeLineUpEmbed = async (lineUp, isMix, guild, timeStamp) => {
   
    lineUp.sort((x, y) => { return (x.isCan === y.isCan)? 0 : x.isCan? -1 : 1;});
    if(isMix) {
        let roster_nb = 0;
        let roster = "";
                
        for(let elt of lineUp) {
            let member = await guild.members.fetch(elt.id);
                    
            // is member a Yoshi family player
            if(member.roles.cache.find(role => role.id === "199252384612876289"))
            {
                let msgAdd = elt.isCan ? elt.name : `(${elt.name})`;
                roster += elt.mute ? msgAdd + ":mute: / " : msgAdd+ " / ";
                if(elt.isCan) roster_nb++;
            } 
        }
                
        roster = roster.substring(0,roster.length-2);
        let nbRestant = (6-roster_nb <= 0) ? "" : `**+${(6-roster_nb)}**`;
        let lineupshow = roster + nbRestant;
                
        const classementEmbed = new EmbedBuilder()
            .setColor(3066993)
            .setTitle(`Line up mix <t:${timeStamp}:t> :`)
            .setFooter({text : `Line up mix`})
            .addFields({name: `__Yoshi Family : (${roster_nb}/6)__`, value: lineupshow })
            .setTimestamp(new Date())
        
        return classementEmbed

    } else {
        let rosterGnb = 0;
        let rosterOnb = 0;
        let rosterCanG = "";
        let rosterCanO = "";

        for(let elt of lineUp) {
            let member = await guild.members.fetch(elt.id);

            if(member.roles.cache.find(role => role.id === "643871029210513419"))
            {
                let msgAdd = elt.isCan ? elt.name : `(${elt.name})`;
                rosterCanG += elt.mute ? msgAdd + ":mute: / " : msgAdd+ " / ";
                if(elt.isCan) rosterGnb++;
            } 
            else if(member.roles.cache.find(role => role.id === "643569712353116170"))
            {
                let msgAdd = elt.isCan ? elt.name : `(${elt.name})`;
                rosterCanO += elt.mute ? msgAdd + ":mute: / " : msgAdd+ " / ";
                if(elt.isCan) rosterOnb++       
            }
        }
                    
        rosterCanG = rosterCanG.substring(0,rosterCanG.length-2);
        rosterCanO = rosterCanO.substring(0,rosterCanO.length-2);
                    
        let nbRestantYFG = (6-rosterGnb <= 0) ? "" : `**+${(6-rosterGnb)}**`;
        let nbRestantYFO = (6-rosterOnb <= 0) ? "" : `**+${(6-rosterOnb)}**`;
    
        let lineupshowYFG = rosterCanG + nbRestantYFG;
        let lineupshowYFO = rosterCanO + nbRestantYFO;
                    
        const classementEmbed = new EmbedBuilder()
            .setColor(3066993)
            .setTitle(`Line up par roster <t:${timeStamp}:t> :`)
            .setFooter({text : `Line up par Roster`})
            .addFields({name: `__YF Galaxy  : (${rosterGnb}/6)__`, value: lineupshowYFG })
            .addFields({name: `__YF Odyssey  : (${rosterOnb}/6)__`, value: lineupshowYFO })
            .setTimestamp(new Date())
            
        return classementEmbed
                   
        }
}

module.exports.config = {
    name: "lu"
}