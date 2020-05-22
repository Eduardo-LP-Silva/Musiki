
const { env } = require('../../environments/env');

exports.get = function get(endpoint, queryParams, callback, state) {

    let link = `${env.API_URL}/${endpoint}`;

    if (queryParams !== undefined) {
        link += "?" + Object.keys(queryParams)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
        .join('&');
    }

    fetch(link, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        callback(data, state); // JSON data parsed by `response.json()` call
     });
}


exports.post = function post(endpoint, body, callback) {
    
    fetch(`${env.API_URL}/${endpoint}/`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: exports.searchParams(body) // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(data => {
        callback(data);
    });
}

// Transform JSON to "x-www-form-urlencoded" format
exports.searchParams = function searchParams(params) {
    return Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
}