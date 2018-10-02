const HttpResponse = require("../../system/HttpResponse")
const SwaggerValidator = require("swagger-object-validator"); // Validador a partir de swagger
const SaltGenerator = require("randomstring");
const SHA256 = require("js-sha256");

const Usuario = require("./Usuario_Model");
const ControllerException = require("../../system/Exceptions").ControllerException;
const ValidationException = require("../../system/Exceptions").ValidationException;

// Declaración de la clase
module.exports = (function() {
    const validator = new SwaggerValidator.Handler(global.swaggerSpec); // Se crea validador a partir de swaggerSpec
    
    function Usuario_Controller() { }   

    /**
     * @swagger
     * definitions:
     * 
     *   Usuario_Crear_Req:
     *     type: object
     *     properties:
     *       correo:
     *         type: string
     *         pattern: '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
     *       nombre:
     *         type: string
     *       apPaterno:
     *         type: string
     *       apMaterno:
     *         type: string
     *       contrasena:
     *         type: string
     *     required:
     *      - correo
     *      - nombre
     *      - apPaterno
     *      - apMaterno
     *      - contrasena
     * 
     *   Usuario_Crear_Res:
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
     */
    Usuario_Controller.prototype.crear = (req, res) => {
        const response = new HttpResponse(res);
        const usuario = new Usuario();

        validator.validateModel(req.body, "Usuario_Crear_Req").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            // Generamos la sal
            req.body.sal = SaltGenerator.generate(32);
            req.body.contrasena = SHA256(req.body.sal + req.body.contrasena);

            return usuario.crear(req.body);
        }).catch(sqlErr => {
            // Validamos duplicados desde base de datos

            if (sqlErr.errno && sqlErr.errno == 1062) { // Duplicado
                throw new ControllerException("conflict", {message: "El correo ya está registrado"});
            } else {
                throw new Error(sqlErr);
            }
        }).then(metaInsert => {
            // Ponemos el nuevo recurso
            res.header("Location", "/usuario/" + metaInsert.insertId);

            // Obtenemos el objeto creado
            return usuario.obtenerPorId(metaInsert.insertId);
        }).then(usuarioNuevo => {
            // Enviamos el nuevo objeto
            response.created(usuarioNuevo[0]);
        }).catch(ControllerException, ValidationException, err => { // Errores de controlador
            // Se responde con lo definido en el objeto de la exepción
            err.response(response);
        }).catch(err => { // Error desconocido

            // Se imprime en consola el error
            console.error(err)

            // Se muestra al usuario un error genérico
            response.ErrorGenerico();
        });
    }

    return Usuario_Controller;
})();