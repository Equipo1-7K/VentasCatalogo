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

            return Venta.obtenerProductosPaginado(req.idUsuario, req.params.id, req.query.page, req.query.perPage);
        }).then(productosVenta => {
            productosVentaObtenidos.items = productosVenta;
            return Venta.obtenerProductosTotal(req.idUsuario, req.params.id);
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
     *             enum:
     *              - Credito
     *              - Contado
     *           acuerdo:
     *             type: string
     *             enum:
     *              - Parcialidades
     *              - Dinero
     *           cantidad:
     *              type: number
     *           intervaloPago:
     *              type: integer
     *           horaPago:
     *              type: string
     *              pattern: '^(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)$'
     *           fechaPrimerPago:
     *              type: string
     *              pattern: '^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$'
     *         required:
     *          - tipo 
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
        validator.validateModel(req.body, "Venta_Agregar_Req").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);
            return Venta.agregar(req.idUsuario, req.body)
        }).then(result => {
            return Venta.obtenerPorId(req.idUsuario, result.insertId)
        }).then(ventaAgregada => {
            response.created(ventaAgregada);
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
            response.noContent();
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
     *   Venta_AgregarAbono_Req:
     *     type: object
     *     properties:
     *       cantidad:
     *         type: number
     */
    Ventas_Controller.prototype.agregarAbono = (req, res) => {
        const response = new HttpResponse(res);
        const Venta = new Ventas_Model();
        validator.validateModel(req.body, "Venta_AgregarAbono_Req").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);
            return Venta.obtenerPorId(req.idUsuario, req.params.id)
        }).then(result => {
            if (!result) throw new ControllerException("notFound", {message: "La venta a abonar no existe"});
            return Venta.obtenerRestantePorAbonarPorId(req.idUsuario, req.params.id);
        }).then(restante => {
            if (req.body.cantidad > restante) throw new ControllerException("conflict", {message: "No se puede abonar mas de lo que se debe"});
            return Venta.agregarAbono(req.params.id, req.body);
        }).then(result => {
            return Venta.obtenerAbonoRealizadoPorId(req.idUsuario, result.insertId);
        }).then(abonoAgregado => {
            response.created(abonoAgregado);
        }).catch(ControllerException, ValidationException, err => {
            err.response(response);
        }).catch(err => {
            console.error(err);
            response.ErrorGenerico();
        })
    }

    /**
     * @swagger
     * definitions:
     * 
     *   VentaAbonosRealizados_ObtenerPaginado_Res:
     *     type: object
     *     properties:
     *       items:
     *         type: array
     *         items:
     *           $ref: '#/definitions/Venta_AbonoRealizado'
     *       total:
     *         type: integer
     */
    Ventas_Controller.prototype.obtenerAbonosRealizadosPaginado = (req, res) => {
        const response = new HttpResponse(res);
        const Venta = new Ventas_Model();

        let abonosRealizadosObtenidos = { };

        try {
            req.query.page = parseInt(req.query.page);
            req.query.perPage = parseInt(req.query.perPage);
        } catch (e) { }

        validator.validateModel(req.query, "Paginado").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            return Venta.obtenerAbonosRealizadosPaginado(req.idUsuario, req.params.id, req.query.page, req.query.perPage);
        }).then(abonosRealizados => {
            abonosRealizadosObtenidos.items = abonosRealizados;
            return Venta.obtenerAbonosRealizadosTotal(req.idUsuario, req.params.id);
        }).then(total => {
            abonosRealizadosObtenidos.total = total || 0;
            response.ok(abonosRealizadosObtenidos);
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
     *   VentaAbonosGenerados_ObtenerPaginado_Res:
     *     type: object
     *     properties:
     *       items:
     *         type: array
     *         items:
     *           $ref: '#/definitions/Venta_AbonoGenerado'
     *       total:
     *         type: integer
     */
    Ventas_Controller.prototype.obtenerAbonosGeneradosPaginado = (req, res) => {
        const response = new HttpResponse(res);
        const Venta = new Ventas_Model();

        let abonosRealizadosObtenidos = { };

        try {
            req.query.page = parseInt(req.query.page);
            req.query.perPage = parseInt(req.query.perPage);
        } catch (e) { }

        validator.validateModel(req.query, "Paginado").then(data => {
            // Si hay errores en la validación, se envía la exepción
            if (data.errors.length > 0) throw new ValidationException(data.errors);

            return Venta.obtenerAbonosGeneradosPaginado(req.idUsuario, req.params.id, req.query.page, req.query.perPage);
        }).then(abonosRealizados => {
            abonosRealizadosObtenidos.items = abonosRealizados;
            return Venta.obtenerAbonosGeneradosTotal(req.idUsuario, req.params.id);
        }).then(total => {
            abonosRealizadosObtenidos.total = total || 0;
            response.ok(abonosRealizadosObtenidos);
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