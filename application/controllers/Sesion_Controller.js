const HttpResponse = require("../system/HttpResponse");
const swaggerConfig = require("../system/SwaggerConfig");
const swaggerJSDoc = require("swagger-jsdoc");
const SwaggerValidator = require("swagger-object-validator");
const SHA256 = require("js-sha256");

const Sesion = require("../models/Sesion_Model");
const Usuario = require("../models/Usuario_Model");
const ControllerException = require("../system/Exceptions").ControllerException;
const ValidationException = require("../system/Exceptions").ValidationException;

// Declaración de la clase
module.exports = (function() {
    const swaggerSpec = swaggerJSDoc(swaggerConfig);
    const validator = new SwaggerValidator.Handler(swaggerSpec);

    function Sesion_Controller() {}

    /**
     * @swagger
     * definitions:
     * 
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
     * 
     *   Sesion_InicioSesion_Res:
     *     type: object
     *     properties:
     *       id:
     *         type: number
     *       correo:
     *         type: string
     *       nombre:
     *         type: string
     *       apPaterno:
     *         type: string
     *       apMaterno:
     *         type: string
     *       token:
     *         type: string
     */
    Sesion_Controller.prototype.iniciarSesion = (req, res) => {
        const response = new HttpResponse(res);
        const sesion = new Sesion();
        const usuario = new Usuario();
        validator.validateModel(req.body, "Sesion_InicioSesion_Req").then(data => {
            console.log(data);
            if (data.errors.length > 0) throw new ValidationException(data.errors);
            console.log(data);

            // Obtenemos las contraseñas del usuario
            return usuario.obtenerContrasenaPorCoreo(req.body.correo);
        }).then(contrasena => {
            // Control de errores
            if (contrasena.length == 0) {
                throw new ControllerException("unauthorized", {message: "Usuario y/o Contraseña incorrecto(s)"});
            }

            // Salamos la contraseña
            const contrasenaBD = SHA256(contrasena[0].sal + req.body.contrasena);

            // Obtenemos los datos del usuario
            return usuario.obtenerParaLogin(req.body.correo, contrasenaBD);
        }).then(usuario => {
            // Control de errores
            if (usuario.length == 0) {
                throw new ControllerException("unauthorized", {message: "Usuario y/o Contraseña incorrecto(s)"});
            }

            // Creamos la sesión
            return sesion.iniciarSesion(usuario);
        }).then(usuario => {
            // Devolvemos el usuario con su token
            response.ok(usuario);
        }).catch(ControllerException, ValidationException, err => {
            err.response(response);
        }).catch(err => {   
            console.error(err);
            response.ErrorGenerico();
        });
    }

    return Sesion_Controller;
})();