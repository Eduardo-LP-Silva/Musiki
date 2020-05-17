const express = require('express');
const path = require('path');
const app = express();
const dbpedia = require('./dbpedia/dbpedia');

if (require('dotenv').config().error != undefined)
	console.log("Failed to read .env!");

app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

dbpedia.start();

//Req = {search_string, node_type, node_name, filters}
app.post('/search', function(req, res) {

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

