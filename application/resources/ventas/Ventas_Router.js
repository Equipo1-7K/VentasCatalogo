/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: Métodos para ventas
 */

const router = require("express").Router();

// Controlador base
const Ventas = new (require("./Ventas_Controller"))();

/**
 * @swagger
 * /ventas:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Ventas
 *     summary: Obtiene ventas paginados
 *     description: Obtiene una página de las ventas correspondientes al usuario con la sesión iniciada
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: page
 *         description: El número de página, comenzando en 1
 *         in: query
 *         required: true
 *         type: integer
 *       - name: perPage
 *         description: Los elementos de página
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: La página de ventas solicitada
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Ventas_ObtenerPaginado_Res'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/", Ventas.obtenerPaginado);

/**
 * @swagger
 * /ventas/{id}:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Ventas
 *     summary: Obtiene una venta por su ID
 *     description: Obtiene una venta a partir de su ID
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: ID de la venta
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: La venta solicitada
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Venta'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/:id", Ventas.obtenerPorId);

/**
 * @swagger
 * /ventas/{id}/productos:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Ventas
 *     summary: Obtiene los productos paginados de una venta
 *     description: Obtiene una página de los productos de una venta correspondiente al usuario con la sesión iniciada
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: page
 *         description: El número de página, comenzando en 1
 *         in: query
 *         required: true
 *         type: integer
 *       - name: perPage
 *         description: Los elementos de página
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: La página de los productos de la ventas solicitada
 *         type: object
 *         schema:
 *           $ref: '#/definitions/ProductosVenta_ObtenerPaginado_Res'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/:id/productos", Ventas.obtenerProductosPaginado);

/**
 * @swagger
 * /ventas:
 *   post:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Ventas
 *     summary: Crear una venta
 *     description: Crea un una venta, calculando los abonos y registrándolos
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: body
 *         description: Datos de la venta nueva
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Venta_Agregar_Req'
 *     responses:
 *       201:
 *         description: La venta nueva
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Venta'
 *       default:
 *         $ref: "#/responses/default"
 */
router.post("/", Ventas.agregar);

/**
 * @swagger
 * /ventas/{id}:
 *   delete:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Ventas
 *     summary: Elimina una Venta
 *     description: Elimina una venta a partir de su ID
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: ID de la venta
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       204:
 *         description: Nada xd
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.delete("/:id", Ventas.eliminar);

/**
 * @swagger
 * /ventas/{id}/abonos:
 *   post:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Ventas
 *     summary: Crear un abono sobre una venta
 *     description: Crea un un abono sobre una venta, calculando lo restante por abonar
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: ID de la venta
 *         in: path
 *         required: true
 *         type: integer
 *         schema:
 *           $ref: '#/definitions/Venta_AgregarAbono_Req'
 *       - name: body
 *         description: Datos del abono nuevo
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Venta_AgregarAbono_Req'
 *     responses:
 *       201:
 *         description: El abono realizado
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Venta_AbonoRealizado'
 *       default:
 *         $ref: "#/responses/default"
 */
router.post("/:id/abonos", Ventas.agregarAbono);

/**
 * @swagger
 * /ventas/{id}/abonos/realizados:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Ventas
 *     summary: Obtiene los abonos realizados paginados de una venta
 *     description: Obtiene una página de los abonos realizados de una venta correspondiente al usuario con la sesión iniciada
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: El ID de la venta
 *         in: path
 *         required: true
 *         type: integer
 *       - name: page
 *         description: El número de página, comenzando en 1
 *         in: query
 *         required: true
 *         type: integer
 *       - name: perPage
 *         description: Los elementos de página
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: La página de los abonos realizados de la ventas solicitada
 *         type: object
 *         schema:
 *           $ref: '#/definitions/VentaAbonosRealizados_ObtenerPaginado_Res'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/:id/abonos/realizados", Ventas.obtenerAbonosRealizadosPaginado);

/**
 * @swagger
 * /ventas/{id}/abonos/generados:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Ventas
 *     summary: Obtiene los abonos generados paginados de una venta
 *     description: Obtiene una página de los abonos generados de una venta correspondiente al usuario con la sesión iniciada
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: El ID de la venta
 *         in: path
 *         required: true
 *         type: integer
 *       - name: page
 *         description: El número de página, comenzando en 1
 *         in: query
 *         required: true
 *         type: integer
 *       - name: perPage
 *         description: Los elementos de página
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: La página de los abonos generados de la ventas solicitada
 *         type: object
 *         schema:
 *           $ref: '#/definitions/VentaAbonosGenerados_ObtenerPaginado_Res'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/:id/abonos/generados", Ventas.obtenerAbonosGeneradosPaginado);

// Método no admitido
const HttpResponse = require("../../system/HttpResponse");
router.use((req, res) => {
    const response = new HttpResponse(res);
    response.methodNotAllowed({
        message: `El método ${req.method} no está disponible para esta ruta`
    });
});

module.exports = router;