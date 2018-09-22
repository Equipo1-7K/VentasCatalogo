// console.log(require("os").networkInterfaces());

__appconfig = require("./appConfig");

const config = __appconfig.express;
const app = require("./application/app");

console.log("Iniciando servidor en modo desarrollo");
app.listen(config.port, () => {
    console.log("Server listening on port " + config.port);
});