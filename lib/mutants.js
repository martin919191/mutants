'use strict';
const HttpServer = require('./httpServer');
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || process.env.HTTP_PORT  || 3001;
console.info(`Starting server...`);
let httpServer = new HttpServer();
httpServer.listen(host, port);