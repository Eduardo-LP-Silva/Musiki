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
  

//Req = {search_string, node_type, node_name, filters}
app.post('/search', async function(req, res) {

    let {search_string} = req.body;
   
    res.status(200);
   
    if (search_string === "") {
        res.send(createNode("null", search_string));
        return;
    }

    //DBpedia resources start with capital letters
    search_string = search_string[0].toUpperCase() + search_string.slice(1);
    //DBpedia resources have _ instead of spaces
    search_string = search_string.replace(/\s/g, '_');

    console.log(search_string);

    dbpedia.values(search_string, undefined, (result) => {

        if (result.results.bindings.length > 0) {
            res.send(createNode(detectNodeType(result.results.bindings), search_string));
            return;
        }

        res.send(createNode("null", search_string));
    });
});

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
        node_type: nodeType,
    };
}

// setTimeout(() => { dbpedia.values("Metallica", []); }, 5000);

// setTimeout(() => { dbpedia.entities("Metallica,dbo:artist ", [], []); }, 7000);

