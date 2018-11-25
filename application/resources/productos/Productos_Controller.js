const HttpResponse = require("../../system/HttpResponse")
const SwaggerValidator = require("swagger-object-validator"); // Validador a partir de swagger

const Productos_Model = require("./Productos_Model");
const ControllerException = require("../../system/Exceptions").ControllerException;
const ValidationException = require("../../system/Exceptions").ValidationException;

// Declaración de la clase
module.exports = (function() {
    const validator = new SwaggerValidator.Handler(global.swaggerSpec); // Se crea validador a partir de swaggerSpec
    
    function Productos_Controller() { }
    
    /**
     * @swagger
     * definitions:
     * 
     *   Producto_Agregar_Req:
     *     type: object
     *     properties:
     *       nombre:
     *         type: string
     *         maxLength: 50
     *       descripcion:
     *         type: string
     *       precio:
     *         type: number
     *     required:
     *      - nombre
     *      - descripcion
     *      - precio
     */
    Productos_Controller.prototype.agregar = (req, res) => {
        const response = new HttpResponse(res);
        const Producto = new Productos_Model();

        validator.validateModel(req.body, "Producto_Agregar_Req").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(  data.errors);

            return Producto.agregar(req.idUsuario, req.body);
        }).then(result => {
            return Producto.obtenerPorId(req.idUsuario, result.insertId);
        }).then(productoAgregado => {
            // Ponemos el nuevo recurso
            res.header("Location", "/producto/" + productoAgregado.id);

            // Enviamos el nuevo objeto
            response.created(productoAgregado);
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
    Productos_Controller.prototype.obtenerPorId = (req, res) => {
        const response = new HttpResponse(res);
        const Producto = new Productos_Model();

        Producto.obtenerPorId(req.idUsuario, req.params.id).then(producto => {
            if (!producto) {
                throw new ControllerException("notFound", {message: "El producto no existe"})
            } else {
                response.ok(producto);
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
     *   Productos_ObtenerPaginado_Res:
     *     type: object
     *     properties:
     *       items:
     *         type: array
     *         items:
     *           $ref: '#/definitions/Producto'
     *       total:
     *         type: integer
     */
    Productos_Controller.prototype.obtenerPaginado = (req, res) => {
        const response = new HttpResponse(res);
        const Producto = new Productos_Model();

        let productosObtenidos = { };

        try {
            req.query.page = parseInt(req.query.page);
            req.query.perPage = parseInt(req.query.perPage);
        } catch (e) { }

        validator.validateModel(req.query, "Paginado").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            return Producto.obtenerPaginado(req.idUsuario, req.query.page, req.query.perPage);
        }).then(productos => {
            productosObtenidos.items = productos;
            return Producto.obtenerTotal(req.idUsuario);
        }).then(total => {
            productosObtenidos.total = total || 0;
            response.ok(productosObtenidos);
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
     *   Producto_Modificar_Req:
     *     type: object
     *     properties:
     *       nombre:
     *         type: string
     *         maxLength: 50
     *       descripcion:
     *         type: string
     *       precio:
     *         type: number
     *     required:
     *      - nombre
     *      - descripcion
     *      - precio
     */
    Productos_Controller.prototype.modificar = (req, res) => {
        const response = new HttpResponse(res);
        const Producto = new Productos_Model();

        Producto.obtenerPorId(req.idUsuario, req.params.id).then(producto => {
            if (!producto) {
                throw new ControllerException("notFound", {message: "El producto no existe"})
            }

            return validator.validateModel(req.body, "Producto_Modificar_Req");
        }).then(data => {

            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            return Producto.modificar(req.idUsuario, req.params.id, req.body);
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

    Productos_Controller.prototype.eliminar = (req, res) => {
        const response = new HttpResponse(res);
        const Producto = new Productos_Model();

        Producto.obtenerPorId(req.idUsuario, req.params.id).then(producto => {
            if (!producto) {
                throw new ControllerException("notFound", {message: "El producto no existe"})
            }

            return Producto.eliminar(req.idUsuario, req.params.id);
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

    return Productos_Controller;
})();