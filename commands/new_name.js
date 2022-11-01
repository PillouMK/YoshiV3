const Discord = require('discord.js');
const { patchPlayer } = require('../controller/apiController');
/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    if(args[1] == undefined) {
        message.reply({content:"Tu n'as pas mis de nouveau pseudo"});
        return;
    }
    args.shift();
    let newName = args.join(` `);
    if(newName.length > 16) {
        message.reply({content: `"${newName}" est trop long, le pseudo doit faire 15 caractères maximum`});
        return;
    }
    let player = await patchPlayer(message.author.id, newName);
    if(player.statusCode === 200) {
        message.reply({content: `${newName} est ton nouveau pseudo`});
        console.log(player.data);
    } else {
        message.reply({content: "Une erreur est survenue"});
        console.log(player.data);
    }
    

}

module.exports.config = {
    name: "new_name"
}
