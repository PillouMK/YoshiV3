const bdd_botwar    = require("../bdd/bot-war.json");

// Botwar - Vérification des places
const verifNoDoublon = (arrayPlace) => {
    
    arrayPlace.sort();
    for(let i = 0;i<arrayPlace.length-1;i++)
    {
        if(arrayPlace[i] === arrayPlace[i+1])
        {
            return true;
        }
    }
    return false;
}

// Botwar - Conversion des places en points
const placeToPoint = (arrayPlace) => {
    console.log("ici", arrayPlace);
    if(arrayPlace.length === 6)
    {
        console.log(arrayPlace);
        let totalYF = 0;
        
        for(let value of arrayPlace)
        {
            switch (value)
            {
                case '1': totalYF += 15;break;
                case '2': totalYF += 12;break;
                case '3': totalYF += 10;break;
                case '4': totalYF += 9;break;
                case '5': totalYF += 8;break;
                case '6': totalYF += 7;break;
                case '7': totalYF += 6;break;
                case '8': totalYF += 5;break;
                case '9': totalYF += 4;break;
                case '10': totalYF += 3;break;
                case '11': totalYF += 2;break;
                case '12': totalYF += 1;break;
                default: return false;
            }
        }
        return totalYF;
    }
}

const makeBotWarResponse = (id_channel, race, nameMap) => {

    let scoreYF         = bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"][race]; 
    let penaYF          = bdd_botwar["botwar"][id_channel]["team1"]["PenaYF"];
    let team1           = bdd_botwar["botwar"][id_channel]["team1"]["NameTeam"];
    let newTotalYF      = bdd_botwar["botwar"][id_channel]["team1"]["TotalYF"];
    let recapYF         = bdd_botwar["botwar"][id_channel]["team1"]["recapScoreYF"];

    let scoreAdv        = bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"][race];
    let penaADV         = bdd_botwar["botwar"][id_channel]["team2"]["PenaADV"]; 
    let team2           = bdd_botwar["botwar"][id_channel]["team2"]["NameTeam"];
    let newTotalAdv     = bdd_botwar["botwar"][id_channel]["team2"]["TotalADV"];
    let recapADV        = bdd_botwar["botwar"][id_channel]["team2"]["recapScoreADV"];

    let raceCount       = bdd_botwar["botwar"][id_channel]["paramWar"]["race"];   
    let recapDifShow    = bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"];
    let recapMapShow    = bdd_botwar["botwar"][id_channel]["paramWar"]["recapMap"];
    let scoreDiff       = bdd_botwar["botwar"][id_channel]["paramWar"]["recapDiff"][race];
    let countdiff       = bdd_botwar["botwar"][id_channel]["paramWar"]["totaleDiff"];
    let penaYFshow      = "";
    let penaADVshow     = "";
    if(penaYF > 0)
        {
            penaYFshow = "Pénalité(s): "+penaYF+" ("+(penaYF*20)+" pts)";
        }
        if(penaADV > 0)
        {
            penaADVshow = "Pénalité(s): "+penaADV+" ("+(penaADV*20)+" pts)";
        }
        const embedMessage = "```";

        let recap_this_course   = `${embedMessage}\nCourse n°${raceCount} (${nameMap})\n${team1} = ${scoreYF}\n${team2} = ${scoreAdv}\n    Différences : ${scoreDiff}\n${embedMessage}`;
        let recap_this_war      = `${embedMessage}\nScore total après la course n°${raceCount}\n${team1} = ${newTotalYF}    ${penaYFshow}\n${team2} = ${newTotalAdv}    ${penaADVshow}\n    Différence totale : ${countdiff}\n${embedMessage}`;
        
        let recap_map = "";
            for(let o = 0;o<raceCount;o++)
            {
                let space = (o<9) ? "  | " : " | ";
                recap_map += `${o+1}${space}${team1} ${recapYF[o]} - ${recapADV[o]} ${team2} (${recapDifShow[o]}) sur ${recapMapShow[o]}\n`; 
            }
        let recap_all_map = `${embedMessage}\nRécapitulatif des courses :\n${recap_map}\n${embedMessage}`;
        return recap_this_course + recap_this_war + recap_all_map;
}

module.exports = {
    verifNoDoublon, 
    placeToPoint,
    makeBotWarResponse
};