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

module.exports = router;