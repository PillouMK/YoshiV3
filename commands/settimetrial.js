// require Librairies
const Discord   = require('discord.js');
const fs        = require('fs');

// require BDD
const settings      = require("../bdd/settings.json");
const bdd_tt = require('../bdd/timetrial.json');
const bdd_map = require('../bdd/mapurl.json');
const bdd_listeMembre = require('../bdd/memberList.json');

// require classes
const Fonctions     = require('../fonctions');
const fct           = new Fonctions();

// Regex :
const testTime  = /[\d][\:|\.][\d]{2}[\.|\:][\d]{3}/;

module.exports.run = async (bot, message, args) =>
{
    // mode test (all)
    if(!fct.isModeTest(settings.modeTest.timetrial, settings.idAdmin, message.author.id)) { 
        message.reply("commande désactivé")
        return 
    }

    let id_member;
    let name;
    // Enregistrement du membre
    if(message.mentions.members.first())
    {
        id_member = message.mentions.members.first().id
        name = message.mentions.users.first().username;
    } else {
        id_member = message.author.id
        name = message.author.username;
    }

    let point       = /\./;
    let doublepoint = /\:/gi;
    let map;
    let time;

    if(args.length === 4)
    {
        if(!message.mentions.members.first()) {
            message.reply("Tu as mentionné un utilisateur, donc la commande doit prendre cette forme: !set_tt @membre map temps");
            return;
        }
        map = args[2];
        time = args[3]
    } else {
        if(message.mentions.members.first()) {
            message.reply("Tu as mentionné un utilisateur, donc la commande doit prendre cette forme: !set_tt @membre map temps");
            return;
        }
        map = args[1];
        time = args[2]
    }
    
            if(bdd_tt.timetrial[map])
            {
                if(testTime.test(time) && time.length === 8)
                {
                    let fullp           = time.replace(doublepoint, ".");
                    let tempsString     = fullp.replace(point, ":");
                    let milli           = parseInt(time.slice(5), 10);
                    let minToMil        = parseInt(time.slice(0,1), 10)*60000;
                    let secTomil        = parseInt(time.slice(2,4), 10)*1000;
                    let timeasNumber    = minToMil+secTomil+milli;
                    
                    if(!bdd_tt.timetrial[map][id_member])
                    {
                        bdd_tt.timetrial[map][id_member] = {
                            "name": name,
                            "time": tempsString,
                            "value": timeasNumber
                        }
                        fct.savebdd("./bdd/timetrial.json", bdd_tt);
                        message.channel.send("Nouveau temps pour "+name+" sur "+map+" : "+tempsString);
                        return;
                    }
                    else if(bdd_tt.timetrial[map][id_member]["value"] > timeasNumber)
                    {
                        let oldtime         = bdd_tt.timetrial[map][id_member]["time"];
                        let oldtimevalue    = bdd_tt.timetrial[map][id_member]["value"];
                        let timedif         = oldtimevalue-timeasNumber;
                        let timedifS        = timedif/1000;

                        bdd_tt.timetrial[map][id_member]["time"]    = tempsString;
                        bdd_tt.timetrial[map][id_member]["value"]   = timeasNumber;
                        fct.savebdd("./bdd/timetrial.json", bdd_tt);
                        message.channel.send("Nouveau temps pour "+name+" sur "+map+" : "+tempsString+"\n"+name+" ton précédent record était : "+oldtime+" (-"+timedifS+"s)");
                        return;
                    }
                    else
                    {
                        let oldtime         = bdd_tt.timetrial[map][id_member]["time"];
                        let oldtimevalue    = bdd_tt.timetrial[map][id_member]["value"];
                        let timedif         = oldtimevalue-timeasNumber;
                        let timedifS        = timedif/1000;
                        message.channel.send(name+" ton précédent reccord "+oldtime+" n'a pas été battu (+"+timedifS+"s)");
                        return;
                    }
                }
                else
                {
                    message.reply("les temps doit être au format xx:xx:xxx");
                    return;
                }
            }
            else
            {
                message.reply("attention, "+map+" n'est pas un nom de map valide, tape \"!viewMap\" pour voir la liste des maps");
            }
}

module.exports.config = {
    name: "set_tt"
}
