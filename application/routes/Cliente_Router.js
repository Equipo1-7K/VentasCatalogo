/**
 * @swagger
 * tags:
 *   name: Cliente
 *   description: Métodos para clientes
 */

const router = require("express").Router();
const Cliente_Controller = new (require("../controllers/Cliente_Controller"))();
const Sesion = new (require("../controllers/Sesion_Controller"))();

/**
 * @swagger
 * /clientes:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Cliente
 *     summary: Obtener productos
 *     description: Obtiene todos los productos del usuario con la sesión iniciada
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: El cliente buscado
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Cliente'
 */
router.get("/", Sesion.verificarSesion, Cliente_Controller.obtenerPorUsuario);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Cliente
 *     summary: Obtener cliente por ID
 *     description: Obtiene un cliente por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del cliente a buscar
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: El cliente buscado
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Cliente'
 */
router.get("/:id", Sesion.verificarSesion, Cliente_Controller.obtenerPorId);

/**
 * @swagger
 * /clientes:
 *   post:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Cliente
 *     summary: Crear cliente
 *     description: Crea un cliente y lo asigna a un usuario
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Cuerpo de la solicitud
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/ClienteNuevo'
 *     responses:
 *       200:
 *         description: El cliente agregado
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Cliente'
 */
router.post("/", Sesion.verificarSesion, Cliente_Controller.agregar);

module.exports = router;