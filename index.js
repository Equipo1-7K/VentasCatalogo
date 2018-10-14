const mongoose = require("mongoose");
const app = require("./app");
const fs = require("fs");
var http = require('http');
const https = require("https");

// Los certificados
const privateKey = fs.readFileSync("./ssl/privatekey.pem");
const certificate = fs.readFileSync("./ssl/certificate.pem");
const options = {
    key: privateKey,
    cert: certificate
};

const port = 443;
mongoose.Promise = global.Promise;

const mongoConnectionString = "mongodb://127.0.0.1:27017/ventasCatalogo";

mongoose.connect(mongoConnectionString, {useNewUrlParser: true})
    .then(() => {
        console.log("Se ha conectado a la base de datos");
        https.createServer(options, app).listen(port, () => {
            console.log("Server listening on port " + port);
        })

        // Redirect from http port 80 to https
        http.createServer(function (req, res) {
            res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
            res.end();
        }).listen(80, () => {
            console.log("Redirecting from port 80");
        });

    })
    .catch((err) => { console.log(err); });
