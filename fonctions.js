const fs = require('fs');
const bdd_lineup = require("./bdd/lineup.json");
const settings = require("./bdd/settings.json");

    // Sauvegarde des fichier json
    function saveBDD(chemin, require) {
    fs.writeFile(chemin, JSON.stringify(require, null, 4), (err) =>
    {
        if(err) console.log("Une erreur est survenue lors de la sauvegarde de : "+chemin+ "\n"+err.message);
        else console.log("Sauvegarde effectué pour : "+chemin);
    });
    }

    // Reset line up
    function deleteAllLineUp() {
        let hour = new Date();
        console.log("Il est : "+(hour.getHours()-1)+" heure");
        if(hour.getHours() == 5 || hour.getHours() == 6 || hour.getHours() == 4)
        {
            bdd_lineup.lineUp = {};
            this.savebdd("./bdd/lineup.json", bdd_lineup);
        }
    }

    function hasard(min, max){
        return min+Math.floor(Math.random()*(max-min+1));
    }

    function adaptHour(horaire) {
        let now = new Date(Date.now());
        now.setHours(horaire-settings.decalageHoraire, 0, 0, 0);
        return (now/1000);   
    }

    const addBlank = (string, number, isAfter = false) => {
        if(!isAfter) {
            while(string.length < number) {
                string = ` ` + string;
            }
            return string;
        } else {
            while(string.length < number) {
                string =  string + ` `;
            }
            return string;
        }
        
    }


module.exports = {saveBDD, deleteAllLineUp, hasard, adaptHour, addBlank};