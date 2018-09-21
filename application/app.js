const express = require("express");
const bodyParser = require("body-parser");

const swaggerConfig = require("./system/SwaggerConfig");
const swaggerJSDoc = require("swagger-jsdoc");
const swagger = require("swagger-ui-express");

const app = express();
const routes = require("./routes/index");

// Inicializamos body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Montamos las rutas de la api
app.use("/api", routes);

// Configuración de Swagger
if (process.env["PROD"] != 1) { // Sólo en desarrollo
    const swaggerSpec = swaggerJSDoc(swaggerConfig);
    app.use("/docs", swagger.serve, swagger.setup(swaggerSpec));
    app.get("/swaggerSpec", (req, res) => {
        res.json(swaggerSpec);
    });
}

// Manejamos el 404
app.use((req, res) => {
    const HttpResponse = new (require("./system/HttpResponse"))(res);
    HttpResponse.notFound(req.url);
});

module.exports = app;