// require librairies :
const fs = require('fs');

// require BDD :
const bdd_lineup = require("./bdd/lineup.json");

class Fonctions {
    
    // Restriction du mode test
    isModeTest(mode, idAdmin, idAuthor) {
        if(mode)
        {
            if(idAdmin != idAuthor) return false
        }
        return true
    }

    // Sauvegarde des fichier json
    savebdd(chemin, require) {
    fs.writeFile(chemin, JSON.stringify(require, null, 4), (err) =>
    {
        if(err) console.log("Une erreur est survenue lors de la sauvegarde de : "+chemin+ "\n"+err.message);
        else console.log("Sauvegarde effectué pour : "+chemin);
    });
    }

    // Reset line up
    deleteAllLineUp() {
        let hour = new Date();
        console.log("Il est : "+(hour.getHours()-1)+" heure");
        if(hour.getHours() == 5 || hour.getHours() == 6 || hour.getHours() == 4)
        {
            bdd_lineup.lineUp = {};
            this.savebdd("./bdd/lineup.json", bdd_lineup);
        }
    }

    // Botwar - Vérification des places
    verifNoDoublon() {
        let tab_arg = Array();
        for(let a = 0; a<arguments.length;a++)
        {
            tab_arg[a] = parseInt(arguments[a]);
        }
        tab_arg.sort();
        for(let i = 0;i<tab_arg.length-1;i++)
        {
            if(tab_arg[i] === tab_arg[i+1])
            {
                return true;
            }
        }
        return false;
    }

    // Botwar - Conversion des places en points
    placeToPoint() {
        if(arguments.length === 6)
        {
            console.log(arguments);
            let totalYF = 0;
            
            for(let value of arguments)
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

    hasard(min, max){
        return min+Math.floor(Math.random()*(max-min+1));
    }

    adaptHour(horaire, decalageHoraire) {
        let now = new Date(Date.now());
        now.setHours(horaire-decalageHoraire, 0, 0, 0);
        return (now/1000);   
    }
}

module.exports = Fonctions;