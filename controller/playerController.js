const Discord  = require('discord.js');
const { getPlayerById, postPlayer, patchPlayer } = require('./apiController');
const { updateClassementTimetrial } = require("./timetrialController")
const galaxy_id = "643871029210513419";
const odyssey_id = "643569712353116170";

/**
 * @param {Discord.Client} bot
 * @param {Discord.GuildMember} member 
 */

const playerAddInGuild = async (bot, member) => {
    if(member.guild.id === "135721923568074753") {
        let player = await getPlayerById(member.user.id);
        if(player.statusCode === 404) {
            let addPlayer = await postPlayer(member.user.id, member.user.username, "NR");
            if(addPlayer.statusCode === 201) {
                try {
                    bot.users.fetch('450353797450039336', false).then((user) => {
                        user.send(`Bienvenue ${member.user.username}`);;
                   });
                } catch (err) {
                    console.log(err);
                }
                console.log(`${member.user.username} bien ajouté`);
            } else if(addPlayer.statusCode === 404) {
                console.log("fail ajout :", addPlayer.data);
            } else {
                console.log(`Problème API lors de l'ajout de ${member.user.username}`);
            }
        } else if(player.statusCode === 200){
            try {
                member.guild.channels.cache.get("id_channel").send(`ReBienvenue ${member.user.username}`);
            } catch (err) {
                console.log(err);
            }
            console.log(`${member.user.username} existe déjà`);
        }
        
    } else {
        console.log("wrong server");
    }
}

/**
 * @param {Discord.Client} bot 
 * @param {Discord.GuildMember} oldMember
 * @param {Discord.GuildMember} newMember 
 */

const playerRosterChange = async (bot, oldMember, newMember) => {
    // if oldMember role collection is higher in size than the new one, then a role has been removed
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {      
        let authorRoles = oldMember.roles.cache;
        // Looping through the role and checking which role was removed.
        for(role of authorRoles) {
            role = role[1];
            console.log("role", role.id, role.name);
            // Find the role that have been removed
            if (!newMember.roles.cache.has(role.id)) {
                // galaxy or odyssey role, don't care others
                if(role.id === galaxy_id) {
                    // if galaxy has been removed and player didn't have odyssey role, player become no roster
                    if(newMember.roles.cache.has(odyssey_id)) {
                        let playerPatch = await patchPlayer(newMember.user.id, newMember.user.username, "YFO");
                        if(playerPatch.statusCode === 200) {
                            console.log(`${newMember.user.username} est désormais YFO`);
                            updateClassementTimetrial(bot, false);
                        } else {
                            console.log("fail modif : ", playerPatch.data);
                        }
                    } else {
                        let playerPatch = await patchPlayer(newMember.user.id, newMember.user.username, "NR");
                        if(playerPatch.statusCode === 200) {
                            console.log(`${newMember.user.username} est désormais No Roster`);
                            updateClassementTimetrial(bot, false);
                        } else {
                            console.log("fail modif : ", playerPatch.data);
                        }
                    }
                } else if(role.id === odyssey_id) {
                    // if odyssey has been removed and player didn't have galaxy role, player become no roster
                    if(newMember.roles.cache.has(galaxy_id)) {
                        let playerPatch = await patchPlayer(newMember.user.id, newMember.user.username, "YFG");
                        if(playerPatch.statusCode === 200) {
                            console.log(`${newMember.user.username} est désormais YFG`);
                            updateClassementTimetrial(bot, false);
                        } else {
                            console.log("fail modif : ", playerPatch.data);
                        }
                    } else {
                        let playerPatch = await patchPlayer(newMember.user.id, newMember.user.username, "NR");
                        if(playerPatch.statusCode === 200) {
                            console.log(`${newMember.user.username} est désormais No Roster`);
                            updateClassementTimetrial(bot, false);
                        } else {
                            console.log("fail modif : ", playerPatch.data);
                        }
                    }
                } 
            }
        }
    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) { 
        let authorRoles = newMember.roles.cache;
        // Looping through the role and checking which role was added.
        for(role of authorRoles) {
            role = role[1];
            console.log("role", role.id, role.name);
            // Find the role that have been added
            if (!oldMember.roles.cache.has(role.id)) {
                // galaxy or odyssey role, don't care others             
                if(role.id === galaxy_id || role.id === odyssey_id) {
                    let idRoster = (role.id === galaxy_id) ? "YFG" : "YFO";
                    let playerPatch = await patchPlayer(newMember.user.id, newMember.user.username, idRoster);
                    if(playerPatch.statusCode === 200) {
                        console.log(`${newMember.user.username} est désormais ${role.name}`);
                    } else {
                        console.log("fail modif : ", playerPatch.data);
                    }
                }
            }
        }
    }
}
module.exports = {
    playerAddInGuild,
    playerRosterChange
}