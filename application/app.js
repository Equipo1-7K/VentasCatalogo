const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logCatcher = require("./system/LogCatcher");

const swaggerConfig = require("./system/SwaggerConfig");
const swaggerJSDoc = require("swagger-jsdoc");
const swagger = require("swagger-ui-express");

const app = express();
// const routes = require("./routes/index");

app.use(cors());

// Inicializamos body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Inicializamos swaggerSpec
global.swaggerSpec = swaggerJSDoc(swaggerConfig);

if (process.env["PROD"] != 1) { // Sólo en desarrollo
    app.use("/docs", swagger.serve, swagger.setup(global.swaggerSpec));
    app.get("/swaggerSpec", (req, res) => {
        res.json(swaggerSpec);
    });
}

// Validamos el tipo de contenido (415)
app.use("/api", (req, res, next) => {
    console.log(req.headers["content-type"] !== "application/json");
    if (req.method !== "GET" && 
        req.headers["content-type"] !== "application/json" && 
        req.headers["content-type"] !== "application/x-www-form-urlencoded"
    ) {
        const response = new HttpResponse(res);
        response.unsupportedMediaType({
            message: "Sólo se aceptan formatos 'application/json' ó 'x-www-form-urlencoded'"
        });
    } else {
        next();
    }
});

// Obtenemos los routers
const Sesion_Router = require("./resources/sesion/Sesion_Router");
const Usuario_Router = require("./resources/usuario/Usuario_Router");

// Registramos los routers
app.use("/api", logCatcher); // Middleware para el log de las rutas
app.use("/api/sesion", Sesion_Router);
app.use("/api/usuario", Usuario_Router);

// Manejamos el 404
app.use((req, res) => {
    const HttpResponse = new (require("./system/HttpResponse"))(res);
    HttpResponse.notFound({
        message: `El recurso ${req.method} ${req.url} no se encuentra`
    });
});

module.exports = app;