/**
 * @swagger
 * tags:
 *   name: Sesion
 *   description: Métodos para sesiones
 */

const router = require("express").Router();
const Sesion_Controller = new (require("../controllers/Sesion_Controller"))();

/**
 * @swagger
 * /sesion/iniciar:
 *   post:
 *     tags:
 *       - Sesion
 *     summary: Iniciar Sesion
 *     description: Crea un token de sesión a partir del correo y la contraseña de un usuario
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Datos del inicio de la sesión
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/InicioSesion'
 *     responses:
 *       200:
 *         description: La sesión
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 allOf:
 *                   - $ref: '#/definitions/Usuario'
 *                   - type: object
 *                     properties: 
 *                       token: 
 *                         type: string
 */
router.post("/iniciar", Sesion_Controller.iniciarSesion);

/**
 * @swagger
 * /sesion/verificar:
 *   post:
 *     security:
 *       - JWT: []
 *     tags:
 *       - Sesion
 *     summary: Verificar Sesion
 *     description: Verifica manualmente si un token de sesión es válido, el token se envía por header
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: La sesión
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 allOf:
 *                   - $ref: '#/definitions/Usuario'
 *                   - type: object
 *                     properties: 
 *                       token: 
 *                         type: string
 */
router.post("/verificar", Sesion_Controller.verificarSesion, Sesion_Controller.verificarSesionManual);

/**
 * @swagger
 * /sesion/cerrar:
 *   post:
 *     tags:
 *       - Sesion
 *     summary: Cerrar Sesion
 *     description: Cierra sesión de un token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Datos de la verificación de la sesión
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *     responses:
 *       200:
 *         description: La sesión
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: object
 *                 allOf:
 *                   - $ref: '#/definitions/Usuario'
 *                   - type: object
 *                     properties: 
 *                       token: 
 *                         type: string
 */
router.post("/cerrar", Sesion_Controller.cerrarSesion);

module.exports = router;