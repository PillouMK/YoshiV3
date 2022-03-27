const Discord       = require('discord.js');
const fs            = require('fs');
const bot           = new Discord.Client();
const settings      = require("./bdd/settings.json");
const bdd_lineup    = require("./bdd/lineup.json");
const Fonctions     = require('./fonctions');
const fct           = new Fonctions();

bot.login(settings.token);
bot.commands        = new Discord.Collection();

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
    console.log('Bot lancé V3!');
    bot.user.setStatus("online");
    bot.user.setActivity("Holiday !!!");
    deleteAllLineUp();
})

bot.on("message", async message => 
{
    
	
    if(message.author.bot)
    {
        if(message.author.id !== "801177258920247307") return;
    }
    if(message.channel.type === "dm" && message.author.id !== "801177258920247307")
    {
        bot.users.get("450353797450039336").send(message.author.username+" : "+message.content);
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
            case "GUERRIER" :
                message.channel.send("<:guerrier:921870892760449084>");
                break;
            case "BONNE" : case "ANNEE" : case "SANTE" : case "JOYEUSE" :
            	message.channel.send("<:yugo:566915485019406347>");
            	break;
        }
    })

    if(!message.content.startsWith(prefix)) return;
    // mode test (all)
    if(!fct.isModeTest(settings.modeTest.all, settings.idAdmin, message.author.id)) { 
        message.reply("Bot en mode test - Tout est désactivé")
        return;
    }
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);
})


   function savebdd() {
    fs.writeFile("./bdd/lineup.json", JSON.stringify(bdd_lineup, null, 4), (err) =>
    {
        if(err) console.log("Une erreur est survenue lors de la sauvegarde de : ./bdd/lineup.json \n"+err.message);
        else console.log("Sauvegarde effectué pour : ./bdd/lineup.json");
    });
    }


function deleteAllLineUp()
{ 
    let hour = new Date();
    console.log("Il est : "+hour+" heure");
    if(hour.getHours() == 4)
    {
        bdd_lineup.lineUp = {};
        console.log("BDD Reset")
        savebdd();
    }
}

setInterval(() => {
    let index = fct.hasard(1,6);
    bot.user.setAvatar(`./image/yoshi${index}.png`);
     console.log("new pdp : "+`./image/yoshi${index}.png`);
    deleteAllLineUp();
}, 3600000);




