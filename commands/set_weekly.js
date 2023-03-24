const Discord = require('discord.js');
const { updateClassementTimetrial } = require("../controller/timetrialController");
const { patchWeeklyTT, postWeeklyTT, postTimetrial, patchTimetrial, postTimetrial } = require("../controller/apiController");
/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    const testTime  = /[\d]{1}[\:|\.][\d]{2}[\.|\:][\d]{3}/;
    const idPlayer = '' + message.author.id;
    const idMap = args[1];
    const time = args[2];
    let isShroomLess = false;
    if(args[3] != undefined) {
        if(args[3] === "ni") {
            isShroomLess = true;
        } else {
            message.reply({
                content: `${args[3]} n'est pas un paramètre valide, pour indiquer shroomless écrit : **shroomless** / **shl** ou **ni**`
            });
            return;
        }
    }
    
    if(!testTime.test(time) || time.length !== 8) {
        message.reply({
            content : "le temps doit être au format xx:xx.xxx"
        });
        return;
    }

    // transform x:xx.xxx into millisecond
    let milli = parseInt(time.slice(5), 10);
    let minToMil = parseInt(time.slice(0,1), 10)*60000;
    let secTomil = parseInt(time.slice(2,4), 10)*1000;
    const timeasNumber = minToMil+secTomil+milli;

    let patchWeekly = await patchWeeklyTT(idPlayer, idMap, timeasNumber, isShroomLess);
    if(patchWeekly.statusCode != 200) {
        let postWeekly = await postWeeklyTT(idPlayer, idMap, timeasNumber, isShroomLess);
        if(postWeekly.statusCode == 201) {
            if((postWeekly.data.ttExist && postWeekly.data.newIsBetter) || !postWeekly.data.ttExist) {
                let postTimetrial = await postTimetrial(idPlayer, idMap, timeasNumber, isShroomLess);
                if(patchTimetrial.statusCode == 201) {
                    updateClassementTimetrial(bot, false);
                    endText = `Tu n'avais pas encore de temps pour ${idMap} : C'est enregistré !`
                }
            }
            let response = isShroomLess ? `en shroomless`: `avec items`;
            message.reply({
                content : `Nouveau temps Weekly : ${time} ${response} \n${endText}`
            });
        } else {
            message.reply({
                content : `erreur : ${idMap} ${response} n'est pas en weekly tiemtrial cette semaine !`
            })
        }
    } else {
        let endText = "";
        if(patchWeekly.data.newIsBetter) {
            let patchTimetrial = await patchTimetrial(idPlayer, idMap, timeasNumber, isShroomLess);
            if(patchTimetrial.statusCode == 200) {
                updateClassementTimetrial(bot, false);
                endText = `Tu as également battu ton record personnel qui était de : ${patchTimetrial.data.oldTime} (${patchTimetrial.data.diff}s)`
            }
        }
        let response = isShroomLess ? "en shroomless": "avec items";
        message.reply({
            content : `Nouveau temps Weekly: ${patchWeekly.data.newWeekly } (${patchWeekly.data.diff}s) ${response}\nTon ancien temps était : ${patchWeekly.data.oldWeekly} \n${endText}`
        });
        
    }


}


module.exports.config = {
    name: "set_tt"
}
