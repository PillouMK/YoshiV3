const Discord = require('discord.js');
const { timeToMs } = require('../fonctions');
const { getAllMaps, postTimetrial, patchTimetrial } = require("../controller/apiController");
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
     
    let mapsArray = await getAllMaps();
    
    // check if the map exist
    if(mapsArray.statusCode === 200) {
        if(mapsArray.data.findIndex(x => x.idMap.toLowerCase() === idMap.toLowerCase()) == -1) {
            message.reply({
                content : `${idMap} n'est pas un nom de map valide`
            });
            return;
        }
    } else {
        console.log(mapsArray.data);
        message.reply({
            content : `API error, contacte <@450353797450039336>`
        });
        return; 
    }

    if(!testTime.test(time) || time.length !== 8) {
        message.reply({
            content : "le temps doit être au format xx:xx.xxx"
        });
        return;
    }

    // transform x:xx.xxx into millisecond
    const timeasNumber = timeToMs(time);

    let patch = await patchTimetrial(idPlayer, idMap, timeasNumber, isShroomLess);
    if(patch.statusCode != 200) {
        let post = await postTimetrial(idPlayer, idMap, timeasNumber, isShroomLess);
        if(post.statusCode == 201) {
            let response = isShroomLess ? `en shroomless`: `avec items`;
            message.reply({
                content : `Nouveau temps : ${time} ${response}`
            });
        } else {
            message.reply({
                content : `erreur : ${post.data.toString()}`
            })
            console.log(post.data);
        }
    } else {
        let response = isShroomLess ? "en shroomless": "avec items";
        message.reply({
            content : `Nouveau temps : ${patch.data.newTime} (${patch.data.diff}s) ${response}\nTon ancien temps était : ${patch.data.oldTime} `
        });
    }
}


module.exports.config = {
    name: "set_tt"
}
