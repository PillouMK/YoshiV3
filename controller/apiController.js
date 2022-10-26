const axios = require('axios').default;
require('dotenv').config();
const API_URL = "https://yoshi-family-api.fr/v1"

const header = {
        "Accept" : "application/json",
        "api-key" : process.env.api_key
    }

const getTimetrialsByMap = async (idMap, idRoster = undefined) => {
    let responseObject;
    const timetrials = await axios.get(
        `${API_URL}/timetrial/${idMap}`,
        {
            headers : header,
            params: {
                idRoster: idRoster
            }
        }
    ).then(response => {
        responseObject = {
            statusCode : response.status,
            data : response.data
        }
        return responseObject
    }).catch(error => {
        responseObject = {
            statusCode : error.response.status,
            data : error.response.data
        }
        return responseObject
    });
    return timetrials
}

const getAllMaps = async () => {
    let responseObject;
    const maps = await axios.get(
        `${API_URL}/maps`,
        {headers : header}
    ).then(response => {
        responseObject = {
            statusCode : response.status,
            data : response.data
        }
        return responseObject;
    }).catch(error => {
        responseObject = {
            statusCode : error.response.status,
            data : error.response.data
        }
        return responseObject
    });
    return maps;
}

const getTimetrialsByPlayer = async (idPlayer) => {
    let responseObject;
    const timetrials = await axios.get(
        `${API_URL}/player/${idPlayer}/timetrial`,
        {
            headers : header,
        }
    ).then(response => {
        responseObject = {
            statusCode : response.status,
            data : response.data
        }
        return responseObject;
    }).catch(error => {
        responseObject = {
            statusCode : error.response.status,
            data : error.response.data
        }
        return responseObject
    });
    return timetrials
}

const getProjectMapByRoster = async (idRoster, limit = 10) => {
    let responseObject;
    const projectmap = await axios.get(
        `${API_URL}/projectmap`,
        {
            headers : header,
            params: {
                idRoster: idRoster,
                limit: limit
            }
        }
    ).then(response => {
        responseObject = {
            statusCode : response.status,
            data : response.data
        }
        return responseObject;
    }).catch(error => {
        responseObject = {
            statusCode : error.response.status,
            data : error.response.data
        }
        return responseObject
    });
    return projectmap
}

const getPlayerById = async (idPlayer) => {
    const player = await axios.get(
        `${API_URL}/player/${idPlayer}`,
        {headers : header}
    ).then(response => {
        responseObject = {
            statusCode : response.status,
            data : response.data
        }
        return responseObject;
    }).catch(error => {
        responseObject = {
            statusCode : error.response.status,
            data : error.response.data
        }
        return responseObject
    });
    return player
}

const postTimetrial = async (idPlayer, idMap, time, isShroomless = false) => {
    const timetrial = await axios.post(
        `${API_URL}/timetrial`,
        {
            idMap : idMap,
            idPlayer : idPlayer,
            time : time,
            isShroomless : isShroomless
        },
        {
            headers : header,
        }
    ).then(response => {
        responseObject = {
            statusCode : response.status,
            data : response.data
        }
        return responseObject;
    }).catch(error => {
        responseObject = {
            statusCode : error.response.status,
            data : error.response.data
        }
        return responseObject
    });
    return timetrial;
}

const patchTimetrial = async (idPlayer, idMap, time, isShroomless = false) => {
    let isShroomlessParam = !isShroomless ? 0 : 1;
    console.log(`${API_URL}/timetrial/${idMap}/${idPlayer}/${isShroomlessParam}`)
    const timetrial = await axios.patch(
        `${API_URL}/timetrial/${idMap}/${idPlayer}/${isShroomlessParam}`,
        {
                time : time   
        },
        {
            headers : header,  
        }
    ).then(response => {
        responseObject = {
            statusCode : response.status,
            data : response.data
        }
        return responseObject;
    }).catch(error => {
        responseObject = {
            statusCode : error.response.status,
            data : error.response.data
        }
        return responseObject
    });
    console.log(timetrial)
    return timetrial;
}

module.exports = {
    // GET
    getTimetrialsByMap,
    getAllMaps,
    getTimetrialsByPlayer,
    getProjectMapByRoster,
    getPlayerById,
    // POST
    postTimetrial,
    // Patch
    patchTimetrial
}