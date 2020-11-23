const express = require('express');
const bodyParser = require('body-parser');
const MutantDetector = require('../MutantDetector');

class HttpServer {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.post('/mutant', (req, res) => {
            let dna = req.body['dna'];
            console.info('Received DNA sequence: ' + dna);
            MutantDetector.isMutant(dna).then(function (result) {
                if (result)
                    res.sendStatus(200);
                else
                    res.sendStatus(403);
            });
        });
    }

    listen(host, port) {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, host, (err) => {
                if (err) reject(err);
                console.info(`Listening http on port: ${this.server.address().port}`);
                resolve(this);
            });
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) reject(err);
                console.info('Closing http');
                resolve(this);
            });
        });
    }
}

module.exports = HttpServer;