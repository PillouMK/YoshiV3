const Discord = require('discord.js');
const fs = require('fs');


module.exports.run = async (bot, message, args) =>
{
    if(message.author.id === "450353797450039336")
    {
        let id_target = args[1];
        console.log(id_target);
        args.shift();
        args.shift();
        console.log(args);
        let embed = args.join(" ");
        bot.users.get(id_target).send(embed);
        message.delete();
    }
}
   

module.exports.config = {
    name: "dm"
}
