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

const getProjectMapByRoster = async (idRoster, month, iteration) => {
    let responseObject;
    const projectmap = await axios.get(
        `${API_URL}/projectmap/${idRoster}`,
        {
            headers : header,
            params: {
                month: month, 
                iteration: iteration
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
    let responseObject;
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

const getAllPlayer = async () => {
    let responseObject;
    const player = await axios.get(
        `${API_URL}/player`,
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
    let responseObject;
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
    let responseObject;
    let isShroomlessParam = !isShroomless ? 0 : 1;
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
    return timetrial;
}

const postPlayer = async (idPlayer, namePlayer, idRoster) => {
    let responseObject;
    const player = await axios.post(
        `${API_URL}/player`,
        {
            idPlayer : idPlayer,   
            name : namePlayer,   
            idRoster : idRoster   
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
    return player;
}

const patchPlayer = async (idPlayer, namePlayer = undefined, idRoster = undefined) => {
    let responseObject;
    let body = {};
    if(namePlayer != undefined) body.name = namePlayer
    if(idRoster != undefined) body.idRoster = idRoster
    console.log(body);
    const player = await axios.patch(
        `${API_URL}/player/${idPlayer}`,
        body,
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
    return player;
}

const postProjectMap = async (scoresMaps, scoreMatch, idRoster) => {
    let responseObject;
    const projectMap = await axios.post(
        `${API_URL}/projectmap`,
        {
            scoresMaps : scoresMaps,   
            scoreMatch : scoreMatch,   
            idRoster : idRoster   
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
    return projectMap;
}



module.exports = {
    // GET
    getTimetrialsByMap,
    getAllMaps,
    getTimetrialsByPlayer,
    getProjectMapByRoster,
    getPlayerById,
    getAllPlayer,
    // POST
    postTimetrial,
    postPlayer,
    postProjectMap,
    // Patch
    patchTimetrial,
    patchPlayer
}