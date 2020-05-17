const express = require('express');
const path = require('path');
const dbpedia = require('./dbpedia/dbpedia');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if (require('dotenv').config().error != undefined)
	console.log("Failed to read .env!");

app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

dbpedia.start();

//Req = {search_string, node_type, node_name, filters}
app.post('/search', function(req, res) {
    let {searchStr, nodeType, nodeName, filters} = req.body;

    console.log(req.body);

    if(searchStr != "")
        searchStr = searchStr[0].toUpperCase() + searchStr.slice(1);

    console.log(searchStr);

    filters = Utils.formatFilters(filters);

    console.log(filters);

    switch(nodeType) {
        case "none":
            res.status(200);
            res.json(dbpedia.values(searchStr, filters.join('\n')));
            break;

        case "artist":
            res.status(200);
            res.send(dbpedia.values(searchStr, 'dbo:artist'));
            break;

        default:
            res.status(400);
            res.send({status: "failed"});
            break;
    }
});

// setTimeout(() => { dbpedia.values("Metallica", []); }, 5000);

// setTimeout(() => { dbpedia.entities("Metallica,dbo:artist ", [], []); }, 7000);

