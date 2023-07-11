const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder , ButtonStyle, ComponentType } = require('discord.js');
const {  msToTime } = require("../fonctions");
const bdd_weeklyMap = require("../bdd/weeklyMap.json");



const makeEmbedWeeklyAnnounce = () => {
    const file = new AttachmentBuilder("./image/LaYoshiFamily.png");
    console.log(bdd_weeklyMap.weeklyMaps);
    let weeklyMapEmbed = new EmbedBuilder()
        .setColor(0x1f8b4c)
        .setTitle("Weekly TT maps de la semaine !")
        .setThumbnail("attachment://LaYoshiFamily.png")
        .setTimestamp(Date.now())
        .setFooter({text : `Weekly Map (${bdd_weeklyMap.weeklyMaps.length})`})
        bdd_weeklyMap.weeklyMaps.forEach((element, index) => {
            const emoteIsShroomless = element.isShroomless ? "<:no_mushroom_bot:1033130955470295131>" : "<:mushroom_bot:1033128412405047356>";
            const emoteIsObligatory = element.isObligatory ? ":bangbang:" : ":grey_question:";
            const rosterIndicator = element.roster === "YFG" ? ":green_circle:" : ":blue_circle:"
            let title = `${element.idMap}  : ${rosterIndicator} - ${emoteIsShroomless} - ${emoteIsObligatory}`;
            let textFloor = `:first_place:\`Gold   : ${msToTime(element.goldTime)}\`\n:second_place:\`Silver : ${msToTime(element.silverTime)}\`\n:third_place:\`Bronze : ${msToTime(element.bronzeTime)}\``
            if(index % 2 == 0 && index != 0) weeklyMapEmbed.addFields({name: '\u200b', value: '\u200b'});
            weeklyMapEmbed.addFields({name: title, value: textFloor, inline: true})
            // .addField('\u200b', '\u200b')
        })

        return {
            embeds: [weeklyMapEmbed],
            files: [file]
        }
} 

/**
 * 
 * @param {Discord.Client} bot 
 */

const sendAnnounceInChannel = async (bot, idChannel) => {
    const channel = await bot.channels.cache.get(idChannel);
    const message = makeEmbedWeeklyAnnounce();
    message.content = '<@&199252384612876289> Voici les nouvelles maps weekly de la semaine!\n:green_circle: = YFG et :blue_circle: = YFO\n<:no_mushroom_bot:1033130955470295131> et <:mushroom_bot:1033128412405047356> indiquent si la map est avec ou sans item\n:bangbang: = Map principale et :grey_question: = Map secondaire'
    channel.send(message);
}






module.exports = {
    makeEmbedWeeklyAnnounce,
    sendAnnounceInChannel
}