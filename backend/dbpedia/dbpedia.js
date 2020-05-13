const spawn = require('child_process').spawn;
const path = require('path');
const axios = require ('axios');

let dbpediaAPI;
const port = 5000;

const format = "JSON";
const pretty = 'NONE';
const limit = 100;
const offset = 0;
const version = '1.0.0';
const key = 1234;
const oldVersion = false;

const endpoint = 'http://localhost:' + port + '/api/' + version + '/';

exports.start = function start() {
	
	let dbpediaAPI = spawn(path.join(process.env.JAVA_9_PATH, 'java') || 'java', ['-jar', 'dbpedia-api-1.0.0.jar', '--server.port=' + port], {
		cwd: __dirname
	});

	dbpediaAPI.stdout.on('data', function (data) {
		console.log('dbpedia: ' + data.toString());
	});

	dbpediaAPI.stderr.on('data', function (data) {
		console.log('dbpedia: ' + data.toString());
	});

	dbpediaAPI.on('exit', function (code) {
		console.log('child process exited with code ' + code.toString());
	});
}

exports.values = function values(entities, properties) {
	let link = endpoint + 'values?';
	link += 'entities=' + encodeURIComponent(entities);

	for (let i = 0; i < properties.length; i++) {
		link += '&property=' + encodeURIComponent(properties[i]);
	}

	link = addGenericParameters(link);

	axios.get(link, {
		'Accept': 'application/json'
	})
	.then((response) => {

		let data = response.data;
		console.log(JSON.stringify(data, null, 2));
		return data;
	})
	.catch((error) => {

		let errorMsg = 'Failed to make GET request on ' + link;
		console.log(errorMsg);
		return "";
	});

}

exports.entities = function entities(value, filter, ofilter) {
	let link = endpoint + 'entities?';
	link += 'value=' + encodeURIComponent(value);

	for (let i = 0; i < filter.length; i++) {
		link += '&filter=' + encodeURIComponent(filter[i]);
	}

	for (let i = 0; i < ofilter.length; i++) {
		link += '&ofilter=' + encodeURIComponent(ofilter[i]);
	}
	
	link = addGenericParameters(link);

	axios.get(link, {
		'Accept': 'application/json'
	})
	.then((response) => {

		let data = response.data;
		console.log(JSON.stringify(data, null, 2));
	})
	.catch((error) => {

		let errorMsg = 'Failed to make GET request on ' + link;
		console.log(errorMsg);
	});

}


function addGenericParameters(originalLink) {

	originalLink += '&format=' + format;
	originalLink += '&pretty=' + pretty;
	originalLink += '&limit=' + limit;
	originalLink += '&offset=' + offset;
	originalLink += '&key=' + key;
	originalLink += '&oldVersion=' + oldVersion;

	return originalLink;
}