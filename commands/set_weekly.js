const Discord = require('discord.js');
const { patchWeeklyTT, postWeeklyTT} = require("../controller/apiController");

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    const testTime  = /[\d][\:|\.][0-5][\d][\.|\:][\d]{3}/;
    const idPlayer = '' + message.author.id;
    const idMap = args[1];
    const time = args[2];
    let isShroomLess = false;
    if(args[3] != undefined) {
        if(args[3] === "ni") {
            isShroomLess = true;
        } else {
            message.reply({
                content: `${args[3]} n'est pas un paramètre valide, pour indiquer shroomless écrit : **ni**`
            });
            return;
        }
    }
    
    if(!testTime.test(time) || time.length !== 8) {
        message.reply({
            content : "le temps doit être au format x:xx.xxx"
        });
        return;
    }

    // transform x:xx.xxx into millisecond
    let milli = parseInt(time.slice(5), 10);
    let minToMil = parseInt(time.slice(0,1), 10)*60000;
    let secTomil = parseInt(time.slice(2,4), 10)*1000;
    const timeasNumber = minToMil+secTomil+milli;

    let endText = "";
    let patchWeekly = await patchWeeklyTT(idPlayer, idMap, timeasNumber, isShroomLess);
    if(patchWeekly.statusCode == 404) {
        console.log(patchWeekly.data);
        let postWeekly = await postWeeklyTT(idPlayer, idMap, timeasNumber, isShroomLess);
        if(postWeekly.statusCode == 201) {
            if(!postWeekly.data.ttExist) {
                endText = `Tu n'avais pas encore de temps pour ${idMap} : C'est enregistré !`
            } else if(postWeekly.data.ttExist && postWeekly.data.newIsBetter) {
                endText = `Tu as battu ton record qui était de ${postWeekly.data.timetrial}: C'est enregistré !`

            }
            let response = isShroomLess ? `en shroomless`: `avec items`;
            message.reply({
                content : `Nouveau temps Weekly : ${time} ${response} \n${endText}`
            });
        } else if(postWeekly.statusCode == 409){
            message.reply({
                content : `erreur 409 : ${postWeekly.data.error}`
            })
            console.log(postWeekly.data);
        } else if(postWeekly.statusCode == 400){
            message.reply({
                content : `erreur 400 : ${postWeekly.data.error}`
            })
            console.log(postWeekly.data);
        }
    } else if(patchWeekly.statusCode == 200) {
        let endText = "";
        if(patchWeekly.data.newIsBetter) {
            endText = `Tu as également battu ton record personnel qui était de : ${patchWeekly.data.timetrial}`;
        }
        let response = isShroomLess ? "en shroomless": "avec items";
        message.reply({
            content : `Nouveau temps Weekly: ${patchWeekly.data.newWeekly } (${patchWeekly.data.diff}s) ${response}\nTon ancien temps était : ${patchWeekly.data.oldWeekly} \n${endText}`
        });
        console.log(patchWeekly.data);

    } else if(patchWeekly.statusCode == 400) {
        message.reply({
            content : `erreur 400 : ${patchWeekly.data.error}`
        });
        console.log(patchWeekly.data);

    }
}


module.exports.config = {
    name: "set_weeklytt"
}
