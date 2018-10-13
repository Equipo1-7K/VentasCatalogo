const HttpResponse = require("../../system/HttpResponse")
const SwaggerValidator = require("swagger-object-validator"); // Validador a partir de swagger

const Ventas_Model = require("./Ventas_Model");
const ControllerException = require("../../system/Exceptions").ControllerException;
const ValidationException = require("../../system/Exceptions").ValidationException;

// Declaración de la clase
module.exports = (function() {
    const validator = new SwaggerValidator.Handler(global.swaggerSpec); // Se crea validador a partir de swaggerSpec
    
    function Ventas_Controller() { }

    /**
     * @swagger
     * definitions:
     * 
     *   Ventas_ObtenerPaginado_Res:
     *     type: object
     *     properties:
     *       items:
     *         type: array
     *         items:
     *           $ref: '#/definitions/Venta'
     *       total:
     *         type: integer
     */
    Ventas_Controller.prototype.obtenerPaginado = (req, res) => {
        const response = new HttpResponse(res);
        const Venta = new Ventas_Model();

        let ventasObtenidas = { };

        try {
            req.query.page = parseInt(req.query.page);
            req.query.perPage = parseInt(req.query.perPage);
        } catch (e) { }

        validator.validateModel(req.query, "Paginado").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            return Venta.obtenerPaginado(req.idUsuario, req.query.page, req.query.perPage);
        }).then(ventas => {
            ventasObtenidas.items = ventas;
            return Venta.obtenerTotal(req.idUsuario);
        }).then(total => {
            ventasObtenidas.total = total || 0;
            response.ok(ventasObtenidas);
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
     *   ProductosVenta_ObtenerPaginado_Res:
     *     type: object
     *     properties:
     *       items:
     *         type: array
     *         items:
     *           $ref: '#/definitions/Venta_Productos'
     *       total:
     *         type: integer
     */
    Ventas_Controller.prototype.obtenerProductosPaginado = (req, res) => {
        const response = new HttpResponse(res);
        const Venta = new Ventas_Model();

        let productosVentaObtenidos = { };

        try {
            req.query.page = parseInt(req.query.page);
            req.query.perPage = parseInt(req.query.perPage);
        } catch (e) { }

        validator.validateModel(req.query, "Paginado").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            return Venta.obtenerProductosPorIdPaginado(req.idUsuario, req.params.id, req.query.page, req.query.perPage);
        }).then(productosVenta => {
            productosVenta.items = productosVenta;
            return Venta.obtenerProductosPorIdTotal(req.idUsuario, req.params.id);
        }).then(total => {
            productosVentaObtenidos.total = total || 0;
            response.ok(productosVentaObtenidos);
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
     *   Venta_Agregar_Req:
     *     type: object
     *     properties:
     *       idCliente:
     *         type: number
     *       pago:
     *         type: object
     *         properties:
     *           tipo:
     *             type: string
     *           acuerdo:
     *              type: string
     *           cantidad:
     *              type: number
     *           intervaloPago:
     *              type: integer
     *           fechaPrimerPago:
     *              type: string
     *         required:
     *          - tipo 
     *          - acuerdo 
     *          - cantidad 
     *          - intervaloPago 
     *          - fechaPrimerPago
     *       productos:
     *         type: array
     *         items:
     *           type: object
     *           properties:
     *             idProducto:
     *               type: integer
     *             cantidad:
     *               type: number
     *           required:
     *            - idProducto
     *            - cantidad
     */
    Ventas_Controller.prototype.agregar = (req, res) => {
        const response = new HttpResponse(res);
        const Venta = new Ventas_Model();
        console.log(validator.validateModel);
        validator.validateModel(req.body, "Venta_Agregar_Req").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);
            return Venta.agregar(req.idUsuario, req.body)
        }).then(result => {
            return Venta.obtenerPorId(req.idUsuario, result.insertId)
        }).then(ventaAgregada => {
            const ventaFormateada = { };
            ventaFormateada.id = ventaAgregada.id;
            ventaFormateada.idCliente = ventaAgregada.idCliente;
            ventaFormateada.pago = {
                tipo: ventaAgregada.tipoPago,
                acuerdo: ventaAgregada.tipoAcuerdo,
                cantidad: ventaAgregada.cantidadAcuerdo,
                intervaloPago: ventaAgregada.intervaloPago,
                fechaPrimerPago: ventaAgregada.fechaPrimerPago
            }
            response.created(ventaFormateada);
        }).catch(ControllerException, ValidationException, err => {
            err.response(response);
        }).catch(err => {
            console.error(err);
            response.ErrorGenerico();
        })
    }

    // Sin documentación de swagger
    Ventas_Controller.prototype.obtenerPorId = (req, res) => {
        const response = new HttpResponse(res);
        const Venta = new Ventas_Model();

        Venta.obtenerPorId(req.idUsuario, req.params.id).then(venta => {
            if (!venta) {
                throw new ControllerException("notFound", {message: "La venta no existe"})
            } else {
                response.ok(venta);
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

    // Sin documentación de swagger
    Ventas_Controller.prototype.eliminar = (req, res) => {
        const response = new HttpResponse(res);
        const Venta = new Ventas_Model();

        Venta.obtenerPorId(req.idUsuario, req.params.id).then(venta => {
            if (!venta) {
                throw new ControllerException("notFound", {message: "La venta no existe"})
            }

            return Venta.eliminar(req.idUsuario, req.params.id);
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

    return Ventas_Controller;
})();