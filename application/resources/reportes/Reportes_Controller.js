const HttpResponse = require("../../system/HttpResponse")
const SwaggerValidator = require("swagger-object-validator"); // Validador a partir de swagger
const SaltGenerator = require("randomstring");
const SHA256 = require("js-sha256");

const Reportes = require("./Reportes_Model");
const ControllerException = require("../../system/Exceptions").ControllerException;
const ValidationException = require("../../system/Exceptions").ValidationException;

// Declaración de la clase
module.exports = (function() {
    const validator = new SwaggerValidator.Handler(global.swaggerSpec); // Se crea validador a partir de swaggerSpec
    
    function Reportes_Controller() { }   

    /**
     * @swagger
     * definitions:
     * 
     *   Reportes_CobrosDia_Res:
     *     type: array
     *     items:
     *       type: object
     *       properties:
     *         idVenta:
     *           type: number
     *         consecutivo:
     *           type: number
     *         fechaAPagar:
     *           type: string
     *         deuda:
     *           type: string
     *         cliente:
     *           $ref: '#/definitions/Cliente'
     */
    Reportes_Controller.prototype.obtenerCobrosDia = (req, res) => {
        const response = new HttpResponse(res);
        const reportes = new Reportes();

        try {
            req.query.page = parseInt(req.query.page);
            req.query.perPage = parseInt(req.query.perPage);
        } catch (e) { }

        validator.validateModel(req.query, "Paginado").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);
            console.log(req.idUsuario, req.query.page, req.query.perPage);
            return reportes.obtenerCobrosDia(req.idUsuario, req.query.page, req.query.perPage);
        }).then(reporte => {
            response.ok(reporte);
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

    return Reportes_Controller;
})();