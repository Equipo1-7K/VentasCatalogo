const HttpResponse = require("../../system/HttpResponse")
const SwaggerValidator = require("swagger-object-validator"); // Validador a partir de swagger

const Clientes_Model = require("./Clientes_Model");
const ControllerException = require("../../system/Exceptions").ControllerException;
const ValidationException = require("../../system/Exceptions").ValidationException;

// Declaración de la clase
module.exports = (function() {
    const validator = new SwaggerValidator.Handler(global.swaggerSpec); // Se crea validador a partir de swaggerSpec
    
    function Clientes_Controller() { }
    
    /**
     * @swagger
     * definitions:
     * 
     *   Cliente_Agregar_Req:
     *     type: object
     *     properties:
     *       nombre:
     *         type: string
     *       apPaterno:
     *         type: string
     *       apMaterno:
     *         type: string
     *     required:
     *      - nombre
     *      - apPaterno
     *      - apMaterno
     */
    Clientes_Controller.prototype.agregar = (req, res) => {
        const response = new HttpResponse(res);
        const Cliente = new Clientes_Model();

        validator.validateModel(req.body, "Cliente_Agregar_Req").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(  data.errors);

            return Cliente.agregar(req.idUsuario, req.body);
        }).then(result => {
            return Cliente.obtenerPorId(req.idUsuario, result.insertId);
        }).then(clienteAgregado => {
            // Ponemos el nuevo recurso
            res.header("Location", "/producto/" + clienteAgregado.id);

            // Enviamos el nuevo objeto
            response.created(clienteAgregado);
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

    // Sin documentación de swagger
    Clientes_Controller.prototype.obtenerPorId = (req, res) => {
        const response = new HttpResponse(res);
        const Cliente = new Clientes_Model();

        Cliente.obtenerPorId(req.idUsuario, req.params.id).then(cliente => {
            if (!cliente) {
                throw new ControllerException("notFound", {message: "El cliente no existe"})
            } else {
                response.ok(cliente);
            }
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


    /**
     * @swagger
     * definitions:
     * 
     *   Cliente_ObtenerPaginado_Res:
     *     type: object
     *     properties:
     *       items:
     *         type: array
     *         items:
     *           $ref: '#/definitions/Cliente'
     *       total:
     *         type: integer
     */
    Clientes_Controller.prototype.obtenerPaginado = (req, res) => {
        const response = new HttpResponse(res);
        const Cliente = new Clientes_Model();

        let clientesObtenidos = { };

        try {
            req.query.page = parseInt(req.query.page);
            req.query.perPage = parseInt(req.query.perPage);
        } catch (e) { }

        validator.validateModel(req.query, "Paginado").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            return Cliente.obtenerPaginado(req.idUsuario, req.query.page, req.query.perPage);
        }).then(clientes => {
            clientesObtenidos.items = clientes;
            return Cliente.obtenerTotal(req.idUsuario);
        }).then(total => {
            clientesObtenidos.total = total || 0;
            response.ok(clientesObtenidos);
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

    /**
     * @swagger
     * definitions:
     * 
     *   Cliente_Modificar_Req:
     *     type: object
     *     properties:
     *       nombre:
     *         type: string
     *       apPaterno:
     *         type: string
     *       apMaterno:
     *         type: string
     *     required:
     *      - nombre
     *      - apPaterno
     *      - apMaterno
     */
    Clientes_Controller.prototype.modificar = (req, res) => {
        const response = new HttpResponse(res);
        const Cliente = new Clientes_Model();

        Cliente.obtenerPorId(req.idUsuario, req.params.id).then(cliente => {
            if (!cliente) {
                throw new ControllerException("notFound", {message: "El cliente no existe"})
            }

            return validator.validateModel(req.body, "Cliente_Modificar_Req");
        }).then(data => {

            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            return Cliente.modificar(req.idUsuario, req.params.id, req.body);
        }).then(data => {
            response.noContent(null);
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

    Clientes_Controller.prototype.eliminar = (req, res) => {
        const response = new HttpResponse(res);
        const Cliente = new Clientes_Model();

        Cliente.obtenerPorId(req.idUsuario, req.params.id).then(producto => {
            if (!producto) {
                throw new ControllerException("notFound", {message: "El cliente no existe"})
            }

            return Cliente.eliminar(req.idUsuario, req.params.id);
        }).then(data => {
            response.noContent(null);
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

    return Clientes_Controller;
})();