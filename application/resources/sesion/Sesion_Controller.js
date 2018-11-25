const HttpResponse = require("../../system/HttpResponse");
const SwaggerValidator = require("swagger-object-validator");
const SHA256 = require("js-sha256");

const Sesion_Model = require("./Sesion_Model");
const Usuarios_Model = require("../usuarios/Usuarios_Model");
const ControllerException = require("../../system/Exceptions").ControllerException;
const ValidationException = require("../../system/Exceptions").ValidationException;

// Declaración de la clase
module.exports = (function() {
    const validator = new SwaggerValidator.Handler(global.swaggerSpec);

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
        const sesion = new Sesion_Model();
        const usuario = new Usuarios_Model();
        console.log("paso 0")
        validator.validateModel(req.body, "Sesion_InicioSesion_Req").then(data => {
            console.log("paso 1")
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            // Obtenemos las contraseñas del usuario
            return usuario.obtenerContrasenaPorCoreo(req.body.correo);
        }).then(contrasena => {
            console.log("paso 2")
            // Control de errores
            if (contrasena.length == 0) {
                throw new ControllerException("unauthorized", {message: "Usuario y/o Contraseña incorrecto(s)"});
            }

            // Salamos la contraseña
            const contrasenaBD = SHA256(contrasena[0].sal + req.body.contrasena);

            // Obtenemos los datos del usuario
            return usuario.obtenerParaLogin(req.body.correo, contrasenaBD);
        }).then(usuario => {
            console.log("paso 3")
            // Control de errores
            if (usuario.length == 0) {
                throw new ControllerException("unauthorized", {message: "Usuario y/o Contraseña incorrecto(s)"});
            }

            // Creamos la sesión
            return sesion.iniciarSesion(usuario[0]);
        }).then(usuario => {
            console.log("paso 4")
            // Devolvemos el usuario con su token
            response.created(usuario);
        }).catch(ControllerException, ValidationException, err => {
            console.log("Ya tronó")
            err.response(response);
        }).catch(err => {   
            console.error(err);
            response.ErrorGenerico();
        });
    }
    
    Sesion_Controller.prototype.cerrarSesion = (req, res) => {
        const response = new HttpResponse(res);
        const Sesion = new Sesion_Model();

        Sesion.cerrarSesion(req.token).then(cierre => {
            response.noContent(null);
        }).catch(err => {
            if (err.status == "exception") {
                response.unauthorized(err);
            } else {
                console.error(err);
                response.ErrorGenerico();
            }
        })
    }

    Sesion_Controller.prototype.verificarSesion = (req, res, next) => {
        const response = new HttpResponse(res);
        const Sesion = new Sesion_Model();

        Sesion.verificarSesion(req.headers["authorization"]).then(verificacion => {
            req.token = req.headers["authorization"];
            req.idUsuario = verificacion.idUsuario;
            delete req.headers["authorization"];
            next();
        }).catch(err => {
            if (err.status == "exception") {
                response.unauthorized({message: "La sesión no está iniciada"});
            } else {
                console.error(err.message);
                response.ErrorGenerico();
            }
        });
    }

    return Sesion_Controller;
})();