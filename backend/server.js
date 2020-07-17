const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const nodeInfo = require('./nodeInfo').nodeInfo;
const dbpedia = require('./dbpedia/dbpedia');

if (require('dotenv').config().error != undefined)
	console.log("Failed to read .env!");

/**
 *  Starts the express.js API and the DBpedia process
 */
app.use(express.static(path.join(__dirname, 'build')));

console.log("Waiting for express API...");

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Done! Express running → PORT ${server.address().port}`);
    dbpedia.start();
});

/**
 *  Allow CORS
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

/**
 *  Searches for an entity on DBpedia
 */
app.get('/search', async function(req, res) {
    const filter = req.query.filter.toLowerCase();
    let queryStr = req.query.queryStr;

    if (queryStr === undefined || queryStr === "") {
        res.status(404);
        res.send(`No results for ${queryStr} of type ${filter} were found.`);
        return;
    }

    queryStr = parseInput(queryStr);

    if(nodeInfo.hasOwnProperty(filter)) {
        const originalStr = parseOutput(queryStr);

        dbpedia.values(queryStr, undefined, (result) => {

            if (result.error !== undefined) {
                res.status(400);
                res.send(result);
            }
            else if(checkInitialNodeType(result.results.bindings, nodeInfo[filter].validation.toUpperCase())) {
                res.status(200);
                res.send(createNode(filter, originalStr));
            }
            else {
                res.status(404);
                res.send(`No results for ${originalStr} of type ${filter} were found.`);
            }
        });
    }
    else {
        res.status(400);
        res.send(`Unknown filter ${filter}`);
    }
});
  
/**
 *  Redirects a values request from DBpedia
 */
app.get('/values', function(req, res) {

    let {entities, properties} = req.query;

    if (entities === undefined || entities === "") {
        res.status(404);
        res.send({error: `No results for ${entities}`});
        return;
    }

    entities = parseInput(entities);

    if (entities != undefined) {
        dbpedia.values(entities, properties, (result) => {

            if (result.error !== undefined) {
                res.status(400);
                res.send({result});
            }
            else 
                if (result.results === undefined || result.results.bindings === undefined || 
                    result.results.bindings.length == 0){
                    res.status(404);
                    res.send({error: `No results for ${req.query.entities}`});
            }
            else {
                res.status(200);
                res.send(result);
            }
        });
    }
    else {
        res.status(400);
        res.send({});
    }
});

/**
 *  Redirects an entities request from DBpedia
 */
app.get('/entities', function(req, res) {

    let {value, filter, ofilter} = req.query;

    value = parseInput(value);
    
    if (value != undefined) {
        dbpedia.entities(value, filter, ofilter, (result) => {

            if (result.error !== undefined) {
                res.status(400);
                res.send(result);
            }
            else if (result.results.bindings.length == 0){
                res.status(400);
                res.send({error: `No results for ${req.query.value} were found.`});
            }
            else {
                res.status(200);
                res.send(result);
            }
        });
    }
    else {
        res.status(400);
        res.send({});
    }
});

/**
 *  Exports node types and filters
 */
app.get('/nodeInfo', function(req, res) {
   
    res.status(200);
   
    res.send(nodeInfo);
});

/**
 *  Checks the node for a specific type
 */
function checkInitialNodeType(bindings, validation) {
    let args = validation.split(",");
    
    for (let binding of bindings) {
        const value = binding['values'].value.toUpperCase();

        if (args.length == 0) {
            return true;
        }

        for (let i = 0; i < args.length; i++) {
            const validationKeyword = args[i];

            if(value.includes(validationKeyword)) {
                // console.log("validationKeyword = " + validationKeyword + ", value = " + value);
                args.splice(i, 1);
                break;
            }
        }
    }

    return false;
}

/**
 *  Detects a node type
 */
function detectNodeType(bindings) {

    for (let binding of bindings) {
        binding = binding.values.value.toUpperCase();
        
        for (let nodeType in nodeInfo) {
            if (binding.includes(nodeInfo[nodeType].validation.toUpperCase())) {
                return nodeType;
            }
        }
    }

    return "null";
}

/**
 *  Creates a node object
 */
function createNode(nodeType, name) {
    return {
        id: name,
        type: nodeType,
    };
}

/**
 *  Capitalizes first letter and replaces spaces with underscores
 */
function parseInput(queryStr) {
    if (queryStr !== "") {
        //DBpedia resources start with capital letters
        queryStr = queryStr[0].toUpperCase() + queryStr.slice(1);
        //DBpedia resources have _ instead of spaces
        queryStr = queryStr.replace(/\s/g, '_');
    }

    return queryStr;
}

/**
 *  Replaces underscores with spaces
 */
function parseOutput(queryStr) {
    return queryStr.replace(/_/g, ' ');
}