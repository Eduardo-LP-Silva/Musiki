
const { env } = require('../../environments/env');

exports.get = function get(endpoint) {
    fetch(`${env.API_URL}/${endpoint}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        // },
        // body: this.searchParams({
        //     search_string: searchString,
        //     node_type: this.state.selectedNode.type
        // }) // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // JSON data parsed by `response.json()` call
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