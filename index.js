const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildPresences
    ]
  });

const bdd_lineup = require("./bdd/lineup.json");
const { saveBDD, hasard } = require('./fonctions');
const { updateClassementTimetrial } = require("./controller/timetrialController");
const { playerAddInGuild, playerRosterChange} = require("./controller/playerController");
const { updateProjectMapRanking } = require("./controller/projectMapController");
require('dotenv').config();
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder , ButtonStyle, ComponentType } = require('discord.js');


bot.login(process.env.token);
bot.commands = new Discord.Collection();

    
fs.readdir("./commands/", (err, files) =>
{
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");

    if (jsfile.length <= 0)
    {
        return console.log("Impossible de trouver des commandes");
    }

    jsfile.forEach((f, i) => 
    {
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, pull);       
    });
});

bot.on("ready", async () =>
{
    console.log('Bot lancé');
    bot.user.setStatus("online");
    bot.user.setActivity("YoshiV3");
    deleteAllLineUp();
    updateClassementTimetrial(bot, false);
    updateProjectMapRanking(bot, "YFG");
    updateProjectMapRanking(bot, "YFO");
    
})

bot.on('guildMemberAdd', async (member) => {
    // Add new player to databse if don't exist
    playerAddInGuild(bot, member);
});



bot.on("guildMemberUpdate", (oldMember, newMember) => {
    playerRosterChange(bot, oldMember, newMember);
});

bot.on("messageCreate", async message => 
{
    
    if(message.author.bot)
    {
        if(message.author.id !== "671666822470434816") return;
    }
    if(message.channel.type === "dm" && message.author.id !== "671666822470434816")
    {
        bot.users.fetch('450353797450039336', false).then((user) => {
 			user.send(message.author.username+" : "+message.content);
		});
        return;
    }
    
    
    let prefix          = "!";
    let messagearray    = message.content.split(" ");
    let cmd             = messagearray[0];
    let args            = message.content.trim().split(/ +/g);
    
    if(message.content.includes("ultraYF")) {
        if(!message.author.bot) {
            message.channel.send("<:ultraYF:929784961341481031>");
        }
    }

    args.forEach( element => {
        switch(element.toUpperCase()){
            case "RAIKOU" : 
                message.channel.send("<:Raidoof:892105862225735703>");
                break;
            case "SHOCK" : case "SHOCKS" :
                message.channel.send("<:shock:517084305579573302>");
                break;
            case "SENKU" :
                message.channel.send("<:emoji_2:868339646168432670>");
                break;
        }
    })
    
    if(!message.content.startsWith(prefix)) return;  
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);
})




function deleteAllLineUp()
{ 
    let hour = new Date();
    console.log("Il est : "+hour+" heure");
    if(hour.getHours() == 4)
    {
        bdd_lineup.lineUp = {};
        saveBDD("./bdd/lineup.json", bdd_lineup);
    }
}


setInterval(() => {
    let index = hasard(1,6);
    bot.user.setAvatar(`./image/yoshi${index}.png`);
    deleteAllLineUp();
}, 3600000);




