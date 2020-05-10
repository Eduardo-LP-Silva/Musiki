const express = require('express');
const path = require('path');
const app = express();

const dbpedia = require('./dbpedia/dbpedia');

app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

dbpedia.start();

// setTimeout(() => { dbpedia.values("Metallica", []); }, 5000);

setTimeout(() => { dbpedia.entities("Metallica,dbo:artist ", [], []); }, 7000);

