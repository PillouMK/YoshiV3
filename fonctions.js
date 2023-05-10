const fs = require('fs');
const bdd_lineup = require("./bdd/lineup.json");
const settings = require("./bdd/settings.json");

    // Sauvegarde des fichier json
    function saveBDD(chemin, require) {
    fs.writeFileSync(chemin, JSON.stringify(require, null, 4), (err) =>
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

    function timeToMs(time) {
        // transform x:xx.xxx into millisecond
        let milli = parseInt(time.slice(5), 10);
        let minToMil = parseInt(time.slice(0,1), 10)*60000;
        let secTomil = parseInt(time.slice(2,4), 10)*1000;
        return minToMil+secTomil+milli;
    }

    function msToTime(s, isDiff = false) {

        // Pad to 2 or 3 digits, default is 2
        function pad(n, z) {
          z = z || 2;
          return ('00' + n).slice(-z);
        }
      
        let ms = s % 1000;
        s = (s - ms) / 1000;
        let secs = s % 60;
        s = (s - secs) / 60;
        let mins = s % 60;
      
        return !isDiff ? pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3) : secs + '.' + pad(ms, 3);
    }


module.exports = {
    saveBDD, 
    deleteAllLineUp, 
    hasard, 
    adaptHour, 
    addBlank, 
    timeToMs, 
    msToTime
};