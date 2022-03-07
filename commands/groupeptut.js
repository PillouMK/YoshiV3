const Discord = require('discord.js');
const fs = require('fs');


module.exports.run = async (bot, message, args) =>
{
	console.log(1);
    message.channel.send("__**Liens important 404 error**__\n");
    message.channel.send({
        embed: {
            color: 3066993,
            title: "__**Liens:**__",
            fields: [
                {
                name: "**Compte rendu (Google Doc):**",
                value: "https://docs.google.com/document/d/1RM6aUddCRcjbJW09PgJtCF7n72wC6z4nbmK3oQ3ETgs/edit?usp=sharing",
                },
                {
                name: "**Carte heuristique**",
                value: "https://mm.tt/1755192667?t=LWaNWE37c6",
                },
                {
                name: "**Liste membres + rôles**",
                value: "https://discordapp.com/channels/801458531345629215/801458531345629218/801459804814966796",
                },
                {
                name: "**SEO Site e-commerce**",
                value:"https://docs.google.com/document/d/1y0dQRldw8wMaS5262YXL65LzoFWh6g2AVmGqOPfYEOs/edit"
                },
                {
                name: "**BDD texte**",
                value:"https://docs.google.com/document/d/1-tF2IXVRlkQkqeGzWImsl_Zp9ZU1swLSuhs2N55LC_Q/edit?usp=sharing"
                },
                {
                name: "**BDD schéma**",
                value:"https://lucid.app/lucidchart/b92a28e4-0ff0-4471-81c8-ee3e3d2bdd83/edit?shared=true&page=0_0#?folder_id=home&browser=icon"
                },
                {
                name: "**Calendrier prévisionnel**",
                value: "https://docs.google.com/spreadsheets/d/1KqGw9V3zd0FFHIr_-zMNOkaNvuot3_rt7GAEAjFFk3s/edit#gid=0"
                },
                {
                name: "**Arborescence site**",
                value: "https://www.gloomaps.com/tV6e4QGpkk"
                }
            ],
            footer: {
                text: `404 les best`,
            } 
        }});
	console.log(2);
}

module.exports.config = {
    name: "liensptut"
}
