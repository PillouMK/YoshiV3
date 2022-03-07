const bdd_roster = require("../bdd/memberList.json");

class User {
    id;
    name;
    roster;
    mute;

    constructor(id, name, mute){
        this.id = id;
        this.name = name;
        this.roster = this.getRosterFromList(id);
        this.mute = mute;
    }

    getRosterFromList(id){
        if(bdd_roster.Galaxy.indexOf(id) > -1)
        {
            return "Galaxy";
        }
        else if(bdd_roster.Odyssey.indexOf(id) > -1)
        {
            return "Odyssey";
        }
        else return "No Roster";
    }
}
module.exports = User;