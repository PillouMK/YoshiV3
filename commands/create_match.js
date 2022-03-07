const Discord = require('discord.js');
const fs = require('fs');
const bdd_lu = require("../bdd/mku_lu.json");

function Savebdd()
{
    fs.writeFile("./bdd/mku_lu.json", JSON.stringify(bdd_lu, null, 4), (err) =>
    {
        console.log('ok');
        if(err) message.channel.send("Une erreur est survenue");
    });
}
const verifHoraire = /[0-9]{2}/;
const channel4staff = "680148646846529540";
const staff = ["450353797450039336","312668609321107456","133978257006526464","156445194861019136","129353989010620417"];
module.exports.run = async (bot, message, args) =>
{
    if(message.channel.id !== channel4staff){return}
    let id_a = message.author.id;
    let id_author = id_a.toString(10);
    if(staff.indexOf(id_author) === -1){return;}
    if(id_author === "450353797450039336" || id_author === "156445194861019136" || id_author === "129353989010620417")
    {
        let horaire = args[1];
        let adv = args[2];
        
        // vérifier la syntaxe de l'horaire
        if(!verifHoraire.test(horaire))
        {
            message.reply("Le 1er argument doit être l'horaire au format XX");
            return;
        }

        if(!bdd_lu.MKU.Galaxy[horaire])
        {
            bdd_lu.MKU.Galaxy[horaire] = {
                            "versus": adv,
                            "lu": [],
                            "sub": [],
                            "host": ""
                    }
            
            message.channel.send("Match MKU à "+horaire+" contre "+adv+" créé!");
            Savebdd();
        }
        else
        {
            message.reply("il y a déjà un match à cet heure là");
        }
        
    }
    else if(id_author === "450353797450039336" || id_author === "156445194861019136")
    {
        let horaire = args[1];
        let adv = args[2];
        if(!verifHoraire.test(horaire))
        {
            message.reply("Le 1er argument doit être l'horaire au format XX");
            return;
        }
        if(!bdd_lu.MKU.Odyssey[horaire])
        {
            bdd_lu.MKU.Odyssey[horaire] = {
                "versus": adv,
                "lu": [],
                "sub": [],
                "host": ""
            }
        
            message.channel.send("Match MKU à "+horaire+" contre "+adv+" créé!");
            Savebdd();
        }
        else
        {
            message.reply("il y a déjà un match à cet heure là");
        }
    }
    else
    {
        console.log("une erreur est survenue");
    }  
}

module.exports.config = {
    name: "create_match"
}