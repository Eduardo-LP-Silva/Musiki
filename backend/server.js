const express = require('express');
const path = require('path');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const nodeInfo = require('./nodeInfo').nodeInfo;

if (require('dotenv').config().error != undefined)
	console.log("Failed to read .env!");

app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

const dbpedia = require('./dbpedia/dbpedia');
dbpedia.start();

// Allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

app.get('/search', async function(req, res) {
    const filter = req.query.filter.toLowerCase();
    let queryStr = req.query.queryStr;

    queryStr = parseInput(queryStr);

    console.log(queryStr);

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
  

app.get('/values', function(req, res) {

    let {entities, properties} = req.query;

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

app.get('/nodeInfo', function(req, res) {
   
    res.status(200);
   
    res.send(nodeInfo);
});

function checkInitialNodeType(bindings, validation) {
    let args = validation.split(",");
    // console.log("args.length = " + args.length);
    
    for (let binding of bindings) {
        const value = binding['values'].value.toUpperCase();

        // console.log("value = " + value);

        for (let i = 0; i < args.length; i++) {

            const validationKeyword = args[i];

            if(value.includes(validationKeyword)) {

                // console.log("validationKeyword = " + validationKeyword + ", value = " + value);

                args.splice(i, 1);
                break;
            }
        }

        if (args.length == 0) {
            return true;
        }
    }

    return false;
}

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


function createNode(nodeType, name) {
    return {
        id: name,
        type: nodeType,
    };
}

function parseInput(queryStr) {
    //DBpedia resources start with capital letters
    queryStr = queryStr[0].toUpperCase() + queryStr.slice(1);
    //DBpedia resources have _ instead of spaces
    queryStr = queryStr.replace(/\s/g, '_');

    return queryStr;
}

function parseOutput(queryStr) {
    return queryStr.replace(/_/g, ' ');
}