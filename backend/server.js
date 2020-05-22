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
    const filter = req.query.filter;
    let queryStr = req.query.queryStr;

    queryStr = parseInput(queryStr);

    console.log(queryStr);

    if(nodeInfo.hasOwnProperty(filter)) {
        const originalStr = parseOutput(queryStr);

        dbpedia.values(queryStr, undefined, (result) => {
            if(checkInitialNodeType(result.results.bindings, nodeInfo[filter].validation.toUpperCase())) {
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
  

//Req = {search_string, node_type, node_name, filters}
app.post('/search', async function(req, res) {

    let {search_string} = req.body;
   
    res.status(200);
   
    if (search_string === "") {
        res.send(createNode("null", search_string));
        return;
    }

    search_string = parseInput(search_string);
    console.log(search_string);

    dbpedia.values(search_string, undefined, (result) => {

        if (result.results.bindings.length > 0) {
            res.send(createNode(detectNodeType(result.results.bindings), search_string));
            return;
        }

        res.send(createNode("null", search_string));
    });
});

app.get('/values', function(req, res) {

    let {entities, properties} = req.query;

    res.status(200);

    if (entities != undefined) {
        dbpedia.values(entities, properties, (result) => {

            if (result.results.bindings.length > 0) {
                res.send(result);
                return;
            }

            res.send({});
        });
    }
    else {
        res.send({});
    }
});

app.get('/entities', function(req, res) {

    let {value, filter, ofilter} = req.query;

    res.status(200);

    if (value != undefined) {
        dbpedia.entities(value, filter, ofilter, (result) => {

            res.send(result);
        });
    }
    else {
        res.send({});
    }
});

app.get('/nodeInfo', function(req, res) {
   
    res.status(200);
   
    res.send(nodeInfo);
});

function checkInitialNodeType(bindings, validation) {
    for (let binding of bindings) {
        const value = binding['values'].value.toUpperCase();

        if(value.includes(validation))
            return true;
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
    return queryStr.replace(/_/g, ' ')
}