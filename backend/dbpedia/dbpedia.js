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
		// console.log('dbpedia: ' + data.toString());
	});

	dbpediaAPI.stderr.on('data', function (data) {
		console.log('dbpedia: ' + data.toString());
	});

	dbpediaAPI.on('exit', function (code) {
		console.log('child process exited with code ' + code.toString());
	});
}

exports.values = function values(entities, properties, callback) {



	let link = endpoint + 'values?';
	link += 'entities=' + encodeURIComponent(entities);

	try {
		if (properties == undefined)
			properties = [];
		else if (Array.isArray(JSON.parse(properties))) { 
			properties = JSON.parse(properties);	
		}
	}
	catch (e) { // Treat properties as string
		properties = [properties];
	}

	for (let i = 0; i < properties.length; i++) {
		link += '&property=' + encodeURIComponent(properties[i]);
	}

	link = addGenericParameters(link);
	let success = false;

	axios.get(link, {
		'Accept': 'application/json'
	})
	.then((result) => {
		success = true;
		callback(result.data);
	})
	.catch(async function(error) {
		if (!success) {
			console.log('Failed to make GET request on ' + link + ", retrying in 1 sec");
			await new Promise(resolve => setTimeout(resolve, 1000));
			values(entities, properties, callback);
		}
	});
}

exports.entities = function entities(value, filter, ofilter, callback) {
	
	if (filter == undefined)
		filter = [];

	if (ofilter == undefined)
		ofilter = [];

	let link = endpoint + 'entities?';
	link += 'value=' + encodeURIComponent(value);

	try {
		if (Array.isArray(JSON.parse(filter))) {
			filter = JSON.parse(filter);	
		}
	}
	catch (e) {  // Treat filter as string
		filter = [filter];
	}

	for (let i = 0; i < filter.length; i++) {
		link += '&filter=' + encodeURIComponent(filter[i]);
	}

	try {
		if (Array.isArray(JSON.parse(ofilter))) {
			ofilter = JSON.parse(ofilter);	
		}
	}
	catch (e) {  // Treat ofilter as string
		ofilter = [ofilter];
	}

	for (let i = 0; i < ofilter.length; i++) {
		link += '&ofilter=' + encodeURIComponent(ofilter[i]);
	}
	
	link = addGenericParameters(link);
	let success = false;

	axios.get(link, {
		'Accept': 'application/json'
	})
	.then((result) => {
		success = true;
		callback(result.data);
	})
	.catch(async function(error) {
		if (!success) {
			console.log('Failed to make GET request on ' + link + ", retrying in 1 sec");
			await new Promise(resolve => setTimeout(resolve, 1000));
			entities(value, filter, ofilter);
		}
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