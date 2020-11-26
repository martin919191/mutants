const express = require('express');
const bodyParser = require('body-parser');
const MutantDetector = require('../mutantDetector');
const Database = require('../database');

class HttpServer {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.database = new Database();
        this.app.post('/mutant', (req, res) => {
            let dna = req.body['dna'];
            MutantDetector.isMutant(dna).then(function (result) {
                this.database.insertDnaSequence(dna, result);
                if (result)
                    res.sendStatus(200);
                else
                    res.sendStatus(403);
            });
        });

        this.app.get('/', (req, res) => {
            res.send('Hello from the mutant application');
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