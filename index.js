__appconfig = require("./appConfig");
global.Promise = require("bluebird").Promise;

const app = require("./application/app");


console.log("Iniciando servidor en modo desarrollo");
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});