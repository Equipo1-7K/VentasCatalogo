const mongoose = require("mongoose");
const app = require("./app");

// console.log(require("express-list-endpoints")(app));

const port = 3000;
mongoose.Promise = global.Promise;

const mongoConnectionString = "mongodb://127.0.0.1:27017/ventasCatalogo";

mongoose.connect(mongoConnectionString, {useNewUrlParser: true})
    .then(() => {
        console.log("Se ha conectado a la base de datos");
        app.listen(port, () => {
            console.log("Server listening on port " + port);
        });
    })
    .catch((err) => { console.log(err); });
