// require Librairies
const Discord = require('discord.js');
const fs = require('fs');

// require BDD
const bdd_lineupRequire = require("../bdd/lineup.json");
const bdd_lineup = bdd_lineupRequire.lineUp;
const settings = require("../bdd/settings.json");

// require classes
const Fonctions     = require('../fonctions');
const fct           = new Fonctions();

// Regex pattern
const numberTest = /(0[\d]{1})|(1[\d]{1})|(2[0-3]{1})/;

module.exports.run = async (bot, message, args) =>
{
    // mode test (line up)
    if(!fct.isModeTest(settings.modeTest.lineup, settings.idAdmin, message.author.id)) { 
        console.log("missing permissions");
        message.reply("commande désactivée");
        return
    }
    
   
    let memberCan;
    let memberMaybe;
    let horaireList = [];
    let mix = false;

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
   
    // Si option line up mixte
    if(args[(args.length)-1] && args[(args.length)-1].toUpperCase() === "MIX") {mix = true;}

    
        
    horaireList.forEach( horaire => {
        
        let timeStamp = fct.adaptHour(horaire, settings.decalageHoraire);
    
        if(bdd_lineup[horaire])
        {     
            if(bdd_lineup[horaire]["can"].length == 0 && bdd_lineup[horaire]["maybe"] == 0) {
            	message.reply("pas de lu pour <t:"+timeStamp+":t>");
                return;
        	}
            

            if(!mix)
            {
                let rosterGnb = 0;
                let rosterOnb = 0;
                let rosterCanG = "";
                let rosterCanO = "";
                bdd_lineup[horaire]["can"].forEach(elt => {
                    if(elt.roster === "Galaxy")
                    {
                        rosterCanG += elt.mute ? elt.name+ ":mute: / " : elt.name+ " / ";
                        rosterGnb++;
                    } 
                    else if(elt.roster === "Odyssey")
                        {
                            rosterCanO += elt.mute ? elt.name+ ":mute: / " : elt.name+ " / ";
                            rosterOnb++;
                        }
                });

                let rosterMaybeG = "";
                let rosterMaybeO = "";
                bdd_lineup[horaire]["maybe"].forEach(elt => {
                    if(elt.roster === "Galaxy")
                    {
                        rosterMaybeG += elt.mute ? "("+elt.name+ ") :mute: / " : "("+elt.name+ ") / ";
                    } 
                    else if(elt.roster === "Odyssey")
                        {
                            rosterMaybeO += elt.mute ? "("+elt.name+ ") :mute: / " : "("+elt.name+ ") / ";
                        }
                });

                rosterCanG      = rosterCanG.substring(0,rosterCanG.length-2);
                rosterCanO      = rosterCanO.substring(0,rosterCanO.length-2);
                rosterMaybeG    = rosterMaybeG.substring(0,rosterMaybeG.length-2);
                rosterMaybeO    = rosterMaybeO.substring(0,rosterMaybeO.length-2);

                let nbRestantYFG = (6-rosterGnb <= 0) ? "" : "+"+(6-rosterGnb);
                let nbRestantYFO = (6-rosterOnb <= 0) ? "" : "+"+(6-rosterOnb);

                let lineupshowYFG = ""
                if(rosterCanG.length > 0){
                    if(rosterMaybeG.length > 0)
                    {
                        lineupshowYFG = rosterCanG +" / " + rosterMaybeG + nbRestantYFG
                    } 
                    else lineupshowYFG = rosterCanG + nbRestantYFG;
                } 
                else lineupshowYFG = rosterMaybeG + nbRestantYFG;

                let lineupshowYFO = ""
                if(rosterCanO.length > 0){
                    if(rosterMaybeO.length > 0)
                    {
                        lineupshowYFO = rosterCanO +" / " + rosterMaybeO + nbRestantYFO
                    } 
                    else lineupshowYFO = rosterCanO + nbRestantYFO;
                } 
                else lineupshowYFO = rosterMaybeO + nbRestantYFO;

                const classementEmbed = {
                    color: 3066993,
                    title: "Line up par roster "+"<t:"+timeStamp+":t> :",
                    fields:[
                        {
                            name: "__YF Galaxy  : ("+rosterGnb+"/6)__",
                            value: lineupshowYFG
                        },
                        {
                            name: "__YF Odyssey  : ("+rosterOnb+"/6)__",
                            value: lineupshowYFO
                        }
                    ],
                    timestamp: new Date(),
                    footer:
                    {
                        text: "Line up par roster",
                    }
                };
                message.channel.send({embed: classementEmbed});
                }
                else
                {
                memberCan   = bdd_lineup[horaire]["can"];
                memberMaybe = bdd_lineup[horaire]["maybe"];
                let listCan = "";
                let listMaybe = "";
    
                memberCan.forEach(elt => {
                    listCan += elt.name+" / ";
                });
                memberMaybe.forEach(elt => {
                    listMaybe += "("+elt.name+") / ";
                });
    
                listCan     = listCan.substring(0,listCan.length-2);
                listMaybe   = listMaybe.substring(0,listMaybe.length-2);
                    
                let nbJoueur = memberCan.length;
                let nbRestant = (6-nbJoueur <= 0) ? "" : "+"+(6-nbJoueur);

                let lineupshow = ""
                if(listCan.length > 0){
                    if(listMaybe.length > 0)
                    {
                        lineupshow = listCan +" / " + listMaybe + nbRestant;
                    } 
                    else lineupshow = listCan + nbRestant;
                } 
                else lineupshow = listMaybe + nbRestant;

                const classementEmbed = {
                    color: 3066993,
                    title: "Line up mix "+"<t:"+timeStamp+":t> :",
                    fields:[
                        {
                            name: "__Joueurs  : ("+nbJoueur+"/6)__",
                            value: lineupshow,
                            inline: true,
                        }
                    ],
                    timestamp: new Date(),
                    footer:{text: "Line up ",}
                };
                message.channel.send({embed: classementEmbed});
                }  
        } 
        
        else message.reply("lineup existe pas, !can/!maybe "+horaire+"(correspond à <t:"+timeStamp+":t> pour toi) pour en créer une pour cet horaire");
    })
    message.delete();

}

module.exports.config = {
    name: "lu"
}