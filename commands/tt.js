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


module.exports.run = async (bot, message, args) =>
{
    // mode test (all)
    if(!fct.isModeTest(settings.modeTest.timetrial, settings.idAdmin, message.author.id)) { 
        message.reply("commande désactivé")
        return 
    }

    let array4map       = Array();
    let filtreMembre    = [];
    if(args[1] in bdd_tt.timetrial)
    {
        // filtre du classement (YF, YFG, YFO, all) 
        if(args[2])
        {
            let filtre = args[2].toUpperCase();
            switch (filtre)
            {
                case "YFG":
                    filtreMembre = bdd_listeMembre.Galaxy;
                    break;
                case "YFO":
                    filtreMembre = bdd_listeMembre.Odyssey;
                    break;
                case "ALL":
                    // rien faire
                    break;
                default:
                    filtreMembre = bdd_listeMembre.Galaxy.concat(bdd_listeMembre.Odyssey);
            }     
        }
        else
        {
            filtreMembre = bdd_listeMembre.Galaxy.concat(bdd_listeMembre.Odyssey);
        }

        if(JSON.stringify(bdd_tt.timetrial[args[1]]) == '{}')
        {
            message.reply("Il n'y a pas de temps pour cette map");
            return;
        }   
        let map         = args[1];
        let lienMap     = bdd_map.map[args[1]]["minia"];
        let allttbyMap  = bdd_tt.timetrial[args[1]];
        let i = 0;
        for(const property in allttbyMap)
        {
            if(filtreMembre.length > 1)
            {
                if(filtreMembre.indexOf(property) > -1)
                {
                    array4map[i] = allttbyMap[property];
                    i++;
                } 
            }
            else 
            {
                array4map[i] = allttbyMap[property];
                i++;
            }    
        }
        console.log("----------------------------------------------");
        array4map.sort(function compare(a, b)
        {
            if(a.value < b.value)
            {
                return -1;
            }
            if(a.value > b.value)
            { 
                return 1;
            }
            return 0;
        });

        let classement      = "";
        let timeClassment   = "";
        let timeDiffShow    = "";
        for(let a = 0; a<array4map.length ; a++)
        {
            if(a === 0)
            {
                classement      += "`1st`   : **"+array4map[a].name+"**\n";
                timeClassment   += array4map[a].time+"\n";
                timeDiffShow    +="(+0s)\n";
            }
            if(a === 1)
            {
                classement      += "`2nd`   : **"+array4map[a].name+"**\n";
                timeClassment   += array4map[a].time+"\n";
                let dif         = ((array4map[a].value)-(array4map[0].value))/1000;
                timeDiffShow    += "(+"+dif+"s)\n";
            }
            if(a === 2)
            {
                classement      += "`3rd`   : **"+array4map[a].name+"**\n";
                timeClassment   += array4map[a].time+"\n";
                let dif         = ((array4map[a].value)-(array4map[0].value))/1000;
                timeDiffShow    += "(+"+dif+"s)\n";
            }
            if (a > 2 && a < 9)
            {
                classement      += "`"+(a+1)+"th`   : **"+array4map[a].name+"**\n";
                timeClassment   += array4map[a].time+"\n";
                let dif         = ((array4map[a].value)-(array4map[0].value))/1000;
                timeDiffShow    += "(+"+dif+"s)\n";
            }
            if (a == 9)
            {
                classement      += "`"+(a+1)+"th` : **"+array4map[a].name+"**\n";
                timeClassment   += array4map[a].time+"\n";
                let dif         = ((array4map[a].value)-(array4map[0].value))/1000;
                timeDiffShow    += "(+"+dif+"s)\n";
            }
        }
        const classementEmbed = {
            color: 3066993,
            title: "Classement Time-trial  :  "+map,
            thumbnail: {
                url: lienMap,
            },
            fields:[
                {
                    name: "__Membre:__",
                    value: classement,
                    inline: true,
                },
                {
                    name: "__Time:__",
                    value: timeClassment,
                    inline: true,
                },
                {
                    name: "__Diff:__",
                    value: timeDiffShow,
                    inline: true,
                }
            ],
            timestamp: new Date(),
            footer: {
                text: 'Classement TT sur '+map,
            }
        };
        
        message.channel.send({embed: classementEmbed});
    }
    else
    {
        message.reply("la map "+args[1]+" n'existe pas !");
    }
    
}

module.exports.config = {
    name: "classement"
}
