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

    if(member.roles.cache.some(role => role.id === settings.yoshiStaffId) || message.author.id === settings.devId ) {
        // Remove all elements
        bdd_weeklyMap.weeklyMaps = [];
        saveBDD("./bdd/weeklyMap.json", bdd_weeklyMap);
        message.reply({
            content: "Les futures maps weekly ont bien été supprimées"
        });
        return;
    } else {
        message.reply({
            content: "Tu n'as pas la permission d'utiliser cette commande"
        });
    }   
}


module.exports.config = {
    name: "delete_weekly"
}
