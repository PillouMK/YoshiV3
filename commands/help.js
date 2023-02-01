const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    // help command for users
    const embed1 = new EmbedBuilder()
        .setColor(3066993)
        .setTitle("__**Bot-war:**__")
        .addFields(
            { 
                name: "**!startwar X Y :**", 
                value: "Débute un war entre les teams X et Y" },
            {
                name: "**!race X X X X X X Y**",
                value: "Ajoute une course, \"X\" correspond aux 6 places de l'équipe, \"Y\" à la map",
            },
            {
                name: "**!er X X X X X X N MAP**",
                value: "Permet d'éditer une course, \"N\" est le numéro de la course, \"MAP\" la map et \"X\" les 6 placements",
            },
            {
                name: "**!set_team [ROSTER]**",
                value: "Permet de modifier le tag de la team pour le bot-war (YFG et YFO activent la sauvegarde des données)",
            },
            {
                name: "**!pena YF** ou **!pena adv**",
                value: "Permet d'ajouter une pénalité de 20 points à l'une des équipes, YF et adv correspondent à l'équipe visée",
            },
            {
                name: "**!stopwar**",
                value: "Met fin au war du channel courant",
            }
        )
        .setFooter({text: `Guide Bot-war`})

        const embed2 = new EmbedBuilder()
        .setColor(3066993)
        .setTitle("__**Code-ami et enregistrement de code-ami**__")
        .addFields(
                {
                name: "**!fc**",
                value: "Renvoi ton code-ami s'il est enregistré",
                },
                {
                name: "**!fc @membre**",
                value: "Renvoi le code-ami du joueur taggé s'il est enregistré",
                },
                {
                name: "**!setfc xxxx-xxxx-xxxx**",
                value: "Enregistre ton code-ami, ATTENTION: le code-ami doit être au format xxxx-xxxx-xxxx",
                },
                {
                name: "**!setfc @membre xxxx-xxxx-xxxx**",
                value: "Enregistre le code-ami du joueur mentionné, ATTENTION: le code-ami doit être au format xxxx-xxxx-xxxx",
                }
        )
        .setFooter({text: `Guide Code-ami`})

        const embed3 = new EmbedBuilder()
        .setColor(3066993)
        .setTitle("__**Commande Line up **__")
        .addFields(
                {
                name: "**!can [horaire]**",
                value: "Permet de s'enregistrer pour l'horaire voulu (possibilité de mettre plusieurs horaires)",
                },
                {
                name: "**!can @membre [horaire]**",
                value: "Permet d'enregistrer le membre mentionné pour un horaire voulu",
                },
                {
                name: "**!maybe [horaire]**",
                value: "Permet de s'enregistrer pour l'horaire voulu en tant que maybe (possibilité de mettre plusieurs horaires)",
                },
                {
                name: "**!maybe @membre [horaire]**",
                value: "Permet d'enregistrer le membre mentionné pour un horaire voulu en tant que maybe",
                },
                {
                name: "**!drop [horaire]**",
                value: "Permet de se désister d'un horaire (un seul horaire par commande)",
                },
                {
                name: "**!drop @membre [horaire]**",
                value: "Permet de désister le membre mentionné d'un horaire (un seul horaire par commande)",
                },
        )
        .setFooter({text: `Guide line up`})

        const embed4 = new EmbedBuilder()
        .setColor(3066993)
        .setTitle("__**Commande Timetrial **__")
        .addFields(
            {
                name: "**!set_tt [MAP] [TIME]**",
                value: "Permet d'enregistrer un nouveau temps'",
                },
                {
                name: "**!classement [MAP]**",
                value: "Permet de visionner un classement de la map [MAP]",
                },
                {
                    name: "**!new_name [name]**",
                    value: "Permet de modifier ton pseudo pour la base de données (15 caractères limité, pas de caractères spécial ou emoji)",
                }
        )
        .setFooter({text: `Guide Timetrial`})
        
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send("__**Guide des commandes de YoshiV2**__\n");
        });
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send({embeds: [embed1]});
        });
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send({embeds: [embed2]});
        });
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send({embeds: [embed3]});
        });
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send({embeds: [embed4]});
        });
}

module.exports.config = {
    name: "help"
}
