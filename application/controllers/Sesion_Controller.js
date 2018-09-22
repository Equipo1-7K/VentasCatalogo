const HttpResponse = require("../system/HttpResponse");
const swaggerConfig = require("../system/SwaggerConfig");
const swaggerJSDoc = require("swagger-jsdoc");
const SwaggerValidator = require("swagger-object-validator");
const swaggeUI = require("swagger-ui-express");

const Sesion = require("../models/Sesion_Model");

// Declaración de la clase
module.exports = (function() {
    const swaggerSpec = swaggerJSDoc(swaggerConfig);
    const swagger = swaggeUI.setup(swaggerSpec);
    const validator = new SwaggerValidator.Handler(swaggerSpec);

    function Sesion_Controller() {}
    
    /**
     * @swagger
     * definitions:
     *   Sesion_InicioSesion_Req:
     *     type: object
     *     properties:
     *       correo:
     *         type: string
     *         pattern: '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
     *       contrasena:
     *         type: string
     *     required:
     *      - correo
     *      - contrasena
     */
    Sesion_Controller.prototype.iniciarSesion = (req, res) => {
        const response = new HttpResponse(res);
        const sesion = new Sesion();
        validator.validateModel({correo: "asdasd", contrasena: "asdasd", asdasd: "qweqwe"}, "Sesion_InicioSesion_Req").then(data => {
            // Obtenemos el usuario
            response.ok(data);
        }).catch(err => {
            response.internalServerError(err);
        });
    }

    return Sesion_Controller;
})();