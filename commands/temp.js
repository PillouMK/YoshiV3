// require Librairies
const Discord = require('discord.js');
const { postPlayer, postTimetrial } = require("../controller/apiController");
const timetrials = require("../bdd/temp_tt.json");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    const guild = await bot.guilds.fetch("135721923568074753");

    for(map in timetrials.timetrial) {
        for(element in timetrials.timetrial[map]) {
            let data = timetrials.timetrial[map][element];
            let idPlayer = "" + element;
            let idMap = "" + map;
            let time = data.value;
            let add_time = await postTimetrial(idPlayer, idMap, time);
            if(add_time.statusCode === 201) {
                message.channel.send({
                    content : `Nouveau temps : ${idPlayer} ${time} ${idMap}`
                });
            } else {
                message.channel.send({
                    content : `Error : ${idPlayer} ${time} ${idMap}`
                });
                console.log(add_time.statusCode, add_time.data);
            }
        }
    }
}

module.exports.config = {
    name: "post_time"
}
