
const { env } = require('../../environments/env');

exports.get = function get(endpoint, queryParams, callback, state) {

    let link = `${env.API_URL}/${endpoint}`;
    let status;

    if (queryParams !== undefined) {
        link += "?" + Object.keys(queryParams)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
        .join('&');
    }

    fetch(link, {
        method: 'GET'
    })
    .then(response => {
        status = response.status;

        if(status === 404)
            return "Error";

        else if(status === 200)
            return response.json();
    })
    .then(data => {
        callback(data, status, state); // JSON data parsed by `response.json()` call
     });
}


exports.post = function post(endpoint, body, callback, state) {
    
    let status;
    
    fetch(`${env.API_URL}/${endpoint}/`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: exports.searchParams(body) // body data type must match "Content-Type" header
    })
    .then(response => {
        status = response.status;
        return response.json();
    })
    .then(data => {
        callback(data, status, state);
    });
}

// Transform JSON to "x-www-form-urlencoded" format
exports.searchParams = function searchParams(params) {
    return Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
}