const Discord = require('discord.js');
const fs = require('fs');

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 * @param {Array} args 
 */

module.exports.run = async (bot, message, args) =>
{
    
    const msg1 = {
        embed: {
            color: 3066993,
            title: "__**Bot-war:**__",
            fields: [
                {
                    name: "**!startwar X Y :**",
                    value: "Débute un war entre les teams X et Y",
                },
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
            ],
            footer: {
                text: `Guide Bot-war`,
            } 
        }
    };

        const msg2 = {
            embed: {
                color: 3066993,
                title: "__**Code-ami et enregistrement de code-ami**__",
                fields: [
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
                ],
                footer: {
                    text: `Guide Code-ami`,
                } 
            }
        };
       const msg3 = {
            embed: {
                color: 3066993,
                title: "__**Commande Line up **__",
                fields: [
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
                    name: "**!m @membre [horaire]**",
                    value: "Permet d'enregistrer le membre mentionné pour un horaire voulu en tant que maybe",
                    },
                    {
                    name: "**!drop [horaire]**",
                    value: "Permet de se désister d'un horaire (un seul horaire par commande)",
                    },
                    {
                    name: "**!d @membre [horaire]**",
                    value: "Permet de désister le membre mentionné d'un horaire (un seul horaire par commande)",
                    },
                ],
                footer: {
                    text: `Guide line up`,
                } 
            }
        };
        const msg4 = {
            embed: {
                color: 3066993,
                title: "__**Commande Timetrial **__",
                fields: [
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
                ],
                footer: {
                    text: `Guide Timetrial`,
                } 
            }
        };
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send("__**Guide des commandes de YoshiV2**__\n");
        });
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send({embeds: [msg1]});
        });
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send({embeds: [msg2]});
        });
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send({embeds: [msg3]});
        });
        bot.users.fetch(message.author.id, false).then((user) => {
            user.send({embeds: [msg4]});
        });
}

module.exports.config = {
    name: "help"
}
