/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Métodos para usuarios
 */

const router = require("express").Router();
const Usuarios = new (require("./Usuarios_Controller"))();

/**
 * @swagger
 * /usuarios:
 *   post:
 *     tags:
 *      - Usuarios
 *     summary: Crear Usuario
 *     description: Crea un usuario con los datos ingresados
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: body
 *         description: Datos del inicio de la sesión
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Usuario_Crear_Req'
 *     responses:
 *       200:
 *         description: Los datos del usuario y el token de sesión
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Sesion_InicioSesion_Res'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.post("/", Usuarios.crear);

module.exports = router;