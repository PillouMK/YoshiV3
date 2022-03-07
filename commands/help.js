const Discord = require('discord.js');
const fs = require('fs');


module.exports.run = async (bot, message, args) =>
{
    bot.users.get(message.author.id).send("__**Guide des commandes de YoshiV2**__\n");
    bot.users.get(message.author.id).send({
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
                name: "**!er N MAP X X X X X X**",
                value: "Permet d'éditer une course, \"N\" est le numéro de la course, \"MAP\" la map et \"X\" les 6 placements",
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
        }});
        bot.users.get(message.author.id).send({
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
        });
        bot.users.get(message.author.id).send({
            embed: {
                color: 3066993,
                title: "__**Commandes fun et ajout**__",
                fields: [
                    {
                    name: "**!quote**",
                    value: "Renvoi une quote de la YF",
                    },
                    {
                    name: "**!setquote quote**",
                    value: "Enregistre une quote dans la base de donnée, quote correspond à la phrase",
                    },
                    {
                    name: "**!béni**",
                    value: "Renvoi une quote de béni",
                    },
                    {
                    name: "**!setbeni quote**",
                    value: "Enregistre une quote de béni dans la base de donnée, quote correspond à la nouvelle phrase de béni",
                    },
                    {
                    name: "**!gif**",
                    value: "Renvoi un GIF de la base de donnée",
                    },
                    {
                    name: "**!setgif [lien du gif]**",
                    value: "Enregistre un gif, il faut renseigné le lien du gif",
                    },
                    {
                    name: "**!kpop**",
                    value: "Renvoi un même en lien avec la Kpop",
                    }
                ],
                footer: {
                    text: `Guide commandes fun | TOUT ABUS D'AJOUT SERA SANCTIONNÉ`,
                } 
            }
        });
        bot.users.get(message.author.id).send({
            embed: {
                color: 3066993,
                title: "__**Commande Line up (à venir)**__",
                fields: [
                    {
                    name: "**!c [horaire]**",
                    value: "Permet de s'enregistrer pour l'horaire voulu",
                    },
                    {
                    name: "**!c @membre [horaire]**",
                    value: "Permet d'enregistrer le membre mentionné pour un horaire voulu",
                    },
                    {
                    name: "**!m [horaire]**",
                    value: "Permet de s'enregistrer pour l'horaire voulu en tant que maybe",
                    },
                    {
                    name: "**!m @membre [horaire]**",
                    value: "Permet d'enregistrer le membre mentionné pour un horaire voulu en tant que maybe",
                    },
                    {
                    name: "**!d [horaire]**",
                    value: "Permet de se désister d'un horaire",
                    },
                    {
                    name: "**!d @membre [horaire]**",
                    value: "Permet de désister le membre mentionné d'un horaire",
                    },
                    {
                    name: "**!delete lu**",
                    value: "Permet de détrurie toutes les line up (à utiliser minuit passé)",
                    }
                ],
                footer: {
                    text: `Guide line up | PROCHAINEMENT`,
                } 
            }
        });
}

module.exports.config = {
    name: "help"
}
