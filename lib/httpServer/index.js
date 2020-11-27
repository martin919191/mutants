const express = require('express');
const bodyParser = require('body-parser');
const MutantDetector = require('../mutantDetector');
const Database = require('../database');
const db = new Database();

class HttpServer {
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.post('/mutant', (req, res) => {
            let dna = req.body['dna'];
            if (!Array.isArray(dna) || typeof (dna[0]) != "string") res.sendStatus(400);
            else{
                MutantDetector.isMutant(dna).then(function (result) {
                    db.insertDnaSequence(dna.toString(), result);
                    if (result)
                        res.sendStatus(200);
                    else
                        res.sendStatus(403);
                });
            }
        });

        this.app.get('/', (req, res) => {
            res.send('<form method="post" action="/mutant"><input type="submit"></form>');
        });

        this.app.get('/stats', (req, res) => {
            db.getStats().then(function (data) {
                res.send(data);
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

    setDatabase(db) {
        this.database = db;
    }
}

module.exports = HttpServer;