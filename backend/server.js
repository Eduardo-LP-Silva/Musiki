const express = require('express');
const path = require('path');
const app = express();
const { exec } = require('child_process');

app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});


let spawn = require('child_process').spawn;
let dbpediaAPI = spawn('java', ['-jar', 'dbpedia-api-1.0.0.jar', '--server.port=5000'], {
	cwd: path.join(__dirname, '/dbpedia')
});

dbpediaAPI.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString());
});

dbpediaAPI.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

dbpediaAPI.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});
