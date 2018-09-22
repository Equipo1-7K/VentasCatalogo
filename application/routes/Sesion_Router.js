/**
 * @swagger
 * tags:
 *   name: Sesiones
 *   description: Métodos para sesiones
 */

const router = require("express").Router();
const Sesion = new (require("../controllers/Sesion_Controller"))();
const HttpResponse = require("../system/HttpResponse");

/**
 * @swagger
 * /sesion:
 *   post:
 *     tags:
 *      - Sesiones
 *     summary: Iniciar sesión
 *     description: Inicia una sesión a partir de correo y contraseña
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
 *           $ref: '#/definitions/Sesion_InicioSesion_Req'
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
router.post("/", Sesion.iniciarSesion);

// Método no admitido
router.use((req, res) => {
    const response = new HttpResponse(res);
    response.methodNotAllowed({
        message: `El método ${req.method} no está disponible para esta ruta`
    });
});

module.exports = router;