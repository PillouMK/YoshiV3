const Discord = require('discord.js');
const bdd_weeklyMap = require("../bdd/weeklyMap.json");
const { postMapWeekly } = require("../controller/apiController");
const { sendAnnounceInChannel } = require('../controller/weeklyController');
const settings = require('../bdd/settings.json');
const { saveBDD } = require('../fonctions');
/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{

    const guild = await bot.guilds.fetch(settings.yoshiGuildId);
    const member = await guild.members.fetch(message.author.id);
    const arrayWeeklyMaps = bdd_weeklyMap.weeklyMaps;

    if(member.roles.cache.some(role => role.id === settings.yoshiStaffId) || message.author.id === settings.devId ) {
    
        if(!arrayWeeklyMaps.length) {
            message.reply({
                content: "Aucune map n'a été ajouté, tu ne peux pas envoyer des données vides"
            });
            return;
        }
        let post = await postMapWeekly(arrayWeeklyMaps);
        console.log(post.statusCode,  bdd_weeklyMap.weeklyMaps.length);
        if(post.statusCode === 201) {
            message.reply({
                content: `Nouvelles Maps weekly TT misent en lignes !`
            });

            // send announce
            await sendAnnounceInChannel(bot, settings.timetrialAnnounceChannel);

            // Remove all elements
            bdd_weeklyMap.weeklyMaps = [];
            saveBDD("./bdd/weeklyMap.json", bdd_weeklyMap);
            return;
        } else {
            console.log(post.statusCode, post.data);
            message.reply({
                content: `Erreur ${post.statusCode} : <@450353797450039336> ${post.data}`
            });
        }
    } else {
        message.reply({
            content: "Tu n'as pas la permission d'utiliser cette commande"
        })
        return;
    }
}


module.exports.config = {
    name: "send_weeklymap"
}
