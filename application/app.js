const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logCatcher = require("./system/LogCatcher");

const swaggerConfig = require("./system/SwaggerConfig");
const swaggerJSDoc = require("swagger-jsdoc");
const swagger = require("swagger-ui-express");

const app = express();
const routes = require("./resources/routes");

app.use(cors());

// Inicializamos body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Montamos las rutas de la api
app.use("/api", logCatcher, routes);

// Configuración de Swagger

// Inicializamos swaggerSpec
global.swaggerSpec = swaggerJSDoc(swaggerConfig);

if (process.env["PROD"] != 1) { // Sólo en desarrollo
    app.use("/docs", swagger.serve, swagger.setup(global.swaggerSpec));
    app.get("/swaggerSpec", (req, res) => {
        res.json(swaggerSpec);
    });
}

// Manejamos el 404
app.use((req, res) => {
    const HttpResponse = new (require("./system/HttpResponse"))(res);
    HttpResponse.notFound({
        message: `El recurso ${req.method} ${req.url} no se encuentra`
    });
});

module.exports = app;