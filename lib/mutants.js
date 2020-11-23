const HttpServer = require('./httpServer');


module.exports = function Mutants(host, port) {
    host = process.env.HOST || host || 'localhost';
    port = process.env.PORT || process.env.HTTP_PORT || port || 3001;

    console.info(`Starting...`);

    let httpServer = new HttpServer();

    httpServer.listen(host, port);
};