const express = require('express');
const path = require('path');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


if (require('dotenv').config().error != undefined)
	console.log("Failed to read .env!");

app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

const dbpedia = require('./dbpedia/dbpedia');
dbpedia.start();


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  

//Req = {search_string, node_type, node_name, filters}
app.post('/search', function(req, res) {

    let {search_string, node_type, node_name, filters} = req.body;

    console.log(search_string);
    console.log(node_type);
    console.log(node_name);
    console.log(filters);

    switch(node_type) {
        case "artist":
            res.status(200);
            res.send(dbpedia.values(req.params.searchString, 'dbo:artist'));
            return;

        default:
            res.status(400);
            res.send({status: "failed"});
            break;
    }
});

app.get('/search/:selectedNodeType/:searchString', function (req, res) {
    switch(req.params.selectedNodeType) {
        case "artist":
            res.send(dbpedia.values(req.params.searchString, 'dbo:artist'));
            break;
    }
});

// setTimeout(() => { dbpedia.values("Metallica", []); }, 5000);

// setTimeout(() => { dbpedia.entities("Metallica,dbo:artist ", [], []); }, 7000);

