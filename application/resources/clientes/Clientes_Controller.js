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
     *       telefono:
     *         type: string
     *       domicilio:
     *         type: object
     *         properties:
     *           estado:
     *             type: string
     *           municipio:
     *             type: string
     *           cp:
     *             type: string
     *           colonia:
     *             type: string
     *           calle:
     *             type: string
     *           noExterno:
     *             type: string
     *           noInterno:
     *             type: string
     *           referencia:
     *             type: string
     *         required:
     *          - estado 
     *          - municipio 
     *          - cp 
     *          - colonia 
     *          - calle 
     *          - noExterno 
     *          - noInterno 
     *          - referencia 
     *     required:
     *      - nombre
     *      - apPaterno
     *      - apMaterno
     *      - telefono
     */
    Clientes_Controller.prototype.agregar = (req, res) => {
        const response = new HttpResponse(res);
        const Cliente = new Clientes_Model();

        let cliente;
        validator.validateModel(req.body, "Cliente_Agregar_Req").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(  data.errors);

            return Cliente.agregar(req.idUsuario, req.body);
        }).then(result => {
            return Cliente.obtenerPorId(req.idUsuario, result.insertId);
        }).then(clienteAgregado => {
            cliente = clienteAgregado;

            return Cliente.obtenerDomicilioPorId(req.idUsuario, cliente.id);
        }).then(domicilio => {
            cliente.domicilio = domicilio;
            // Ponemos el nuevo recurso
            res.header("Location", "/cliente/" + cliente.id);

            // Enviamos el nuevo objeto
            response.created(cliente);
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
        let clienteRecibido;
        Cliente.obtenerPorId(req.idUsuario, req.params.id).then(cliente => {
            if (!cliente) {
                throw new ControllerException("notFound", {message: "El cliente no existe"})
            }

            clienteRecibido = cliente;
            return Cliente.obtenerDomicilioPorId(req.idUsuario, req.params.id);
        }).then(domicilio => {
            clienteRecibido.domicilio = domicilio;
            response.ok(clienteRecibido);
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
     *       telefono:
     *         type: string
     *     required:
     *      - nombre
     *      - apPaterno
     *      - apMaterno
     *      - telefono
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

    /**
     * @swagger
     * definitions:
     * 
     *   Cliente_ModificarDomicilio_Req:
     *     type: object
     *     properties:
     *       estado:
     *         type: string
     *       municipio:
     *         type: string
     *       cp:
     *         type: string
     *       colonia:
     *         type: string
     *       calle:
     *         type: string
     *       noExterno:
     *         type: string
     *       noInterno:
     *         type: string
     *       referencia:
     *         type: string
     *     required:
     *      - estado
     *      - municipio
     *      - cp
     *      - colonia
     *      - calle
     *      - noExterno
     *      - noInterno
     *      - referencia
     */
    Clientes_Controller.prototype.modificarDomicilio = (req, res) => {
        const response = new HttpResponse(res);
        const Cliente = new Clientes_Model();

        Cliente.obtenerPorId(req.idUsuario, req.params.id).then(cliente => {
            if (!cliente) {
                throw new ControllerException("notFound", {message: "El cliente no existe"})
            }

            return validator.validateModel(req.body, "Cliente_ModificarDomicilio_Req");
        }).then(data => {

            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            return Cliente.modificarDomicilio(req.params.id, req.body);
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