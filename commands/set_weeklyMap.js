const Discord = require('discord.js');
const { timeToMs } = require('../fonctions');
const bdd_weeklyMap = require("../bdd/weeklyMap.json");
const { saveBDD } = require('../fonctions');
const { getAllMaps } = require("../controller/apiController");
const { makeEmbedWeeklyAnnounce } = require("../controller/weeklyController");
const settings = require('../bdd/settings.json');

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
    const testTime  = /[\d][\:|\.][0-5][\d][\.|\:][\d]{3}/;

    if(member.roles.cache.some(role => role.id === settings.yoshiStaffId || message.author.id === settings.devId ) ) {
    
    let mapsArray = await getAllMaps();

    if(args.length != 8) {
        message.reply({
            content: "nombre de paramètres incorrect, voici un exemple : !set_weeklyMap idMap Mode goldTime silverTime bronzeTime obligatoire idRoster\n- Mode = ni ou item\n- obligatoire = oui ou non\n- times : format x.xx.xxx\n- roster : YFG ou YFO"
        });
        return;
    }
    if(mapsArray.statusCode === 200) {
        if(mapsArray.data.findIndex(x => x.idMap === args[1]) == -1) {
            message.channel.send(`${args[1]} n'est pas un nom de map valide`);
            return;
        }

    } else {
        message.reply("Erreur API, je ne peux pas vérifier l'id de la map, je désactive la sauvegarde des données");
    }
    if(args[2] !== "ni" && args[2] !== "item") {
        message.reply({
            content: `${args[2]} n'est pas un mode valide (il faut indiquer "ni" (shroomless) ou "item" (items))`
        })
        return;
    }

    if(args[6] !== "oui" && args[6] !== "non") {
        message.reply({
            content: `${args[6]} n'est pas un mode valide (il faut indiquer "oui" (obligatoire) ou "non" (non obligatoire))`
        })
        return;
    }

    if(args[7].toUpperCase() !== "YFG" && args[7].toUpperCase() !== "YFO") {
        message.reply({
            content: `${args[7]} n'est pas un mode valide (il faut indiquer **YFG** ou **YFG**)`
        })
        return;
    }

    const idMap = args[1];
    const isShroomless  = (args[2] === "ni");
    const goldTime      = args[3];
    const silverTime    = args[4];
    const bronzeTime    = args[5];
    const arrayFloor = [goldTime, silverTime, bronzeTime];
    const isObligatory = (args[6] === "oui");
    const roster = args[7];
    let timeValids = true;
    let mapAlreadySet = false;

    bdd_weeklyMap.weeklyMaps.forEach(element => {
        if(element.idMap === idMap && element.isShroomless === isShroomless) {
            message.reply({
                content: `${idMap} en ${args[2]} est déjà une map enregistré pour le prochain weekly`
            });
            mapAlreadySet = true;
        }
    });

    if(mapAlreadySet) return;

    arrayFloor.forEach(element => {
        if(!testTime.test(element) || element.length !== 8) {
            message.reply({
                content: `${element} n'est pas un format de temps valide (x:xx.xxx)`
            });
            timeValids = false;
        }
    });
    if(!timeValids) return;

    arrayFloor.forEach((element, index) => {
        if(index != 0) {
            if(timeToMs(element) <= timeToMs(arrayFloor[index-1])) {
                message.reply({
                    content: `${element} est plus petit ou égal à ${arrayFloor[index-1]}, la logique des paliers n'est pas respectée`
                });
                timeValids = false;
            }
        }
    });
    if(!timeValids) return;

    const weeklyMapObject = {
        idMap: idMap,
        isShroomless: isShroomless,
        isObligatory: isObligatory,
        goldTime: timeToMs(goldTime),
        silverTime: timeToMs(silverTime),
        bronzeTime: timeToMs(bronzeTime),
        roster: roster
    };

    bdd_weeklyMap.weeklyMaps.push(weeklyMapObject);
    saveBDD("./bdd/weeklyMap.json", bdd_weeklyMap);

    const reply = makeEmbedWeeklyAnnounce();
    reply.content = "Future maps weekly TT ";
    message.reply(reply);

    } else {
        message.reply({
            content: "Tu n'as pas la permission d'utiliser cette commande"
        })
        return;
    }

}


module.exports.config = {
    name: "set_weeklymap"
}
