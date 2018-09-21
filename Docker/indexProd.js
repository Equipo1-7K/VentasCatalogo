const mongoose = require("mongoose");
const app = require("./application/app");
const fs = require("fs");
const https = require("https");
const http = require("http");

mongoose.Promise = global.Promise;
const mongoConnectionString = "mongodb://127.0.0.1:27017/ventasCatalogo";

console.log("Iniciando servidor en modo producción");


// Los certificados
const privateKey = fs.readFileSync("./ssl/privatekey.pem");
const certificate = fs.readFileSync("./ssl/certificate.pem");
const options = {
    key: privateKey,
    cert: certificate
};
const httpsPort = 443;
const httpPort = 80;

mongoose.connect(mongoConnectionString, {useNewUrlParser: true})
    .then(() => {
        console.log("Se ha conectado a la base de datos");
        https.createServer(options, app).listen(httpsPort, () => {
            console.log("Server listening on port " + httpsPort);
        });

        // Redirect from http port 80 to https
        http.createServer(function (req, res) {
            res.writeHead(301, { "Location": "https://" + req.headers["host"] + req.url });
            res.end();
        }).listen(httpPort, () => {
            console.log("Redirecting from port " + httpPort);
        });

    })
    .catch((err) => { console.log(err); });
