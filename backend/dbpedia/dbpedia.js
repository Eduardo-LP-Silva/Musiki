const spawn = require('child_process').spawn;
const path = require('path');
const axios = require ('axios');

let dbpediaAPI;
const port = 5000;
let ready = false;

const format = "JSON";
const pretty = 'NONE';
const limit = 10000;
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

	// Starts checking for dbpedia
	startDBpediaCheck();
}

exports.values = async function values(entities, properties, callback) {

	await waitForDBpedia();

	let link = endpoint + 'values?';
	link += 'entities=' + encodeURIComponent(entities);

	if (properties == undefined) {
		properties = [];
	}
	else if (!Array.isArray(properties)) {
		try {
			if (Array.isArray(JSON.parse(properties))) {
				properties = JSON.parse(properties);	
			}
		}
		catch (e) {  // Treat properties as string
			properties = [properties];
		}
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
			
			callback({error: error.code});
		}
	});
}

exports.entities = async function entities(value, filter, ofilter, callback) {
	
	await waitForDBpedia();

	if (filter == undefined) {
		filter = [];
	}
	else if (!Array.isArray(filter)) {
		try {
			if (Array.isArray(JSON.parse(filter))) {
				filter = JSON.parse(filter);	
			}
		}
		catch (e) {  // Treat filter as string
			filter = [filter];
		}
	}

	if (ofilter == undefined) {
		ofilter = [];
	}
	else if (!Array.isArray(ofilter)) {
		try {
			if (Array.isArray(JSON.parse(ofilter))) {
				ofilter = JSON.parse(ofilter);	
			}
		}
		catch (e) {  // Treat ofilter as string
			ofilter = [ofilter];
		}
	}

	let link = endpoint + 'entities?';
	link += 'value=' + encodeURIComponent(value);

	for (let i = 0; i < filter.length; i++) {
		link += '&filter=' + encodeURIComponent(filter[i]);
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
			callback({error: error.code});
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

// Wait for DBpedia to be alive, polling every 100 ms
async function waitForDBpedia() {
	while (!ready) {
		await new Promise(r => setTimeout(r, 100));
	}
};

function startDBpediaCheck() {
	console.log("Waiting for DBpedia API...");
	checkDBpedia();
}

async function checkDBpedia() {
	const baselineDBpediaURL = endpoint + 'values';

	if (!ready) {
		axios.get(baselineDBpediaURL, {
			'Accept': 'application/json'
		})
		.catch(async function(error) {
			// console.log('Failed to make GET request on ' + baselineDBpediaURL + ", retrying in 1 sec");

			if (error.message.toUpperCase().includes("ECONNREFUSED")) {
				await new Promise(resolve => setTimeout(resolve, 500));
				checkDBpedia();
			}
			else if (error.message.toUpperCase().includes("STATUS CODE 400")) {
				ready = true;
				console.log("Done! Server is ready");
			}
			else {
				console.log("Unknown error on checkDBpedia()");
			}
		});
	}
}
