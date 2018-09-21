/**
 * @swagger
 * tags:
 *   name: Producto
 *   description: Métodos para productos
 */

const router = require("express").Router();
const Producto_Controller = new (require("../controllers/Producto_Controller"))();
const Sesion = new (require("../controllers/Sesion_Controller"))();

/**
 * @swagger
 * /productos:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Producto
 *     summary: Obtener productos
 *     description: Obtiene todos los productos del usuario con la sesión iniciada
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: El producto buscado
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Producto'
 */
router.get("/", Sesion.verificarSesion, Producto_Controller.obtenerPorUsuario);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Producto
 *     summary: Obtener producto por ID
 *     description: Obtiene un producto por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del producto a buscar
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: El producto buscado
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Producto'
 */
router.get("/:id", Sesion.verificarSesion, Producto_Controller.obtenerPorId);

/**
 * @swagger
 * /productos:
 *   post:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Producto
 *     summary: Crear producto
 *     description: Crea un producto y lo asigna a un usuario
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Cuerpo de la solicitud
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/ProductoNuevo'
 *     responses:
 *       200:
 *         description: El producto agregado
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Producto'
 */
router.post("/", Sesion.verificarSesion, Producto_Controller.agregar);

module.exports = router;