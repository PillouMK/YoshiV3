const bdd_roster = require("../bdd/memberList.json");

class User {
    id;
    name;
    roster;
    mute;

    constructor(id, name, mute, isCan){
        this.id = id;
        this.name = name;
        this.mute = mute;
        this.isCan = isCan
    }
}
module.exports = User;