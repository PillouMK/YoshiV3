const Discord = require('discord.js');
const { getAllMaps, postTimetrial, patchTimetrial } = require("../controller/apiController");
/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    const testTime  = /[\d][\:|\.][\d]{2}[\.|\:][\d]{3}/;
    const idPlayer = '' + message.author.id;
    const idMap = args[1];
    const time = args[2];
    const isShroomLess = (args[3] != undefined && args[3] === "shroomless") ? true : false;
    let mapsArray = await getAllMaps();
    
    // check if the map exist
    if(mapsArray.statusCode === 200) {
        if(mapsArray.data.findIndex(x => x.idMap === idMap) == -1) {
            message.channel.send({
                content : `${nameMap} n'est pas un nom de map valide`
            });
            return;
        }
    } else {
        console.log(mapsArray.data);
        message.channel.send({
            content : `API error, contacte <@450353797450039336>`
        });
        return; 
    }

    if(!testTime.test(time) && time.length !== 8) {
        message.channel.send({
            content : "le temps doit être au format xx:xx.xxx"
        });
        return;
    }

    // transform x:xx.xxx into millisecond
    let milli = parseInt(time.slice(5), 10);
    let minToMil = parseInt(time.slice(0,1), 10)*60000;
    let secTomil = parseInt(time.slice(2,4), 10)*1000;
    const timeasNumber = minToMil+secTomil+milli;

    let patch = await patchTimetrial(idPlayer, idMap, timeasNumber, isShroomLess);
    if(patch.statusCode != 200) {
        console.log(patch.data);
        let post = await postTimetrial(idPlayer, idMap, timeasNumber, isShroomLess);
        if(post.statusCode == 201) {
            message.reply({
                content : `Nouveau temps : ${time}`
            })
        } else {
            console.log(post.data);
            message.reply({
                content : `erreur : ${post.data}`
            })
        }
    } else {
        message.reply({
            content : `Nouveau temps : ${patch.data.newTime} (${patch.data.diff}s)\nTon ancien temps était : ${patch.data.oldTime} `
        })
    }


}


module.exports.config = {
    name: "set_tt"
}
