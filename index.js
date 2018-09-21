console.log(require('os').networkInterfaces());

const config = require("./appConfig").express;
const mongoose = require("mongoose");
const app = require("./application/app");

mongoose.Promise = global.Promise;
const mongoConnectionString = "mongodb://192.168.1.1:27017/ventasCatalogo";

console.log("Iniciando servidor en modo desarrollo");
app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});
