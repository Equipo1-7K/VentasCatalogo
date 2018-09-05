/**
 * @swagger
 * tags:
 *   name: Venta
 *   description: Métodos para ventas
 */

const router = require("express").Router();
const Venta_Controller = new (require("../controllers/Venta_Controller"))();
const Sesion = new (require("../controllers/Sesion_Controller"))();

/**
 * @swagger
 * /ventas:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Venta
 *     summary: Obtener productos
 *     description: Obtiene todos los productos del usuario con la sesión iniciada
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: El venta buscado
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Venta'
 */
router.get("/", Sesion.verificarSesion, Venta_Controller.obtenerPorUsuario);

/**
 * @swagger
 * /ventas/{id}:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Venta
 *     summary: Obtener venta por ID
 *     description: Obtiene un venta por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del venta a buscar
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: El venta buscado
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Venta'
 */
router.get("/:id", Sesion.verificarSesion, Venta_Controller.obtenerPorId);

/**
 * @swagger
 * /ventas:
 *   post:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Venta
 *     summary: Crear venta
 *     description: Crea un venta y lo asigna a un usuario
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Cuerpo de la solicitud
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/VentaNuevo'
 *     responses:
 *       200:
 *         description: El venta agregado
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Venta'
 */
router.post("/", Sesion.verificarSesion, Venta_Controller.agregar);

module.exports = router;