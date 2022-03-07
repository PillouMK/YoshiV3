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
        if(!verifHoraire.test(horaire))
        {
            message.reply("Le 1er argument doit être l'horaire au format XX");
            return;
        }
        if(bdd_lu.MKU.Galaxy[horaire])
        {
            for(let i = 2; i<args.length;i++)
            {
                if(bdd_lu.MKU.Galaxy[horaire]["lu"].length < 6)
                {
                    if(bdd_lu.MKU.Galaxy[horaire]["lu"].indexOf(args[i]) === -1)
                    {
                        if(bdd_lu.MKU.Galaxy[horaire]["sub"].indexOf(args[i]) === -1)
                        {
                        bdd_lu.MKU.Galaxy[horaire]["lu"].push(args[i]);
                        Savebdd();
                        message.channel.send(args[i]+" a été ajouté à la line up de "+horaire+" heures !");
                        }
                        else
                        {
                            message.reply("le joueur "+args[i]+" est en sub, enlève le d'abord des subs si tu veux le mettre dans la line up (utilise !remove_sub");
                        }
                    }
                    else
                    {
                        message.reply(args[i]+" est déjà présent dans la line up!");
                    } 
                }
                else
                {
                    message.reply("La line up ne peut pas avoir plus de six joueurs ! fait !remove_lu [horaire] [pseudo] pour enlever un joueur");
                    return;
                }
            }
            return;
        }
        else
        {
            message.reply("Il n'y a pas de match de créé pour "+horaire);
            return;
        }
    }
    else
    {
        let horaire = args[1];
        if(!verifHoraire.test(horaire))
        {
            message.reply("Le 1er argument doit être l'horaire au format XX");
            return;
        }
        if(bdd_lu.MKU.Odyssey[horaire])
        {
            for(let i = 2; i<args.length;i++)
            {
                if(bdd_lu.MKU.Odyssey[horaire]["lu"].length < 7)
                {
                    if(bdd_lu.MKU.Odyssey[horaire]["lu"].indexOf(args[i]) === -1)
                    {
                        if(bdd_lu.MKU.Odyssey[horaire]["sub"].indexOf(args[i]) === -1)
                        {
                        bdd_lu.MKU.Odyssey[horaire]["lu"].push(args[i]);
                        Savebdd();
                        message.channel.send(args[i]+" a été ajouté à la line up de "+horaire+" heures !");
                        }
                        else
                        {
                            message.reply("le joueur "+args[i]+" est en sub, enlève le d'abord des subs si tu veux le mettre dans la line up (utilise !remove_sub");
                        }
                    }
                    else
                    {
                        message.reply(args[i]+" est déjà présent dans la line up!");
                    } 
                }
                else
                {
                    message.reply("La line up ne peut pas avoir plus de six joueurs ! fait !remove_lu [horaire] [pseudo] pour enlever un joueur");
                    return;
                }
                
            }
            return;
        }
        else
        {
            message.reply("Il n'y a pas de match de créé pour "+horaire);
            return;
        }
    }
      
}

module.exports.config = {
    name: "add_lu"
}