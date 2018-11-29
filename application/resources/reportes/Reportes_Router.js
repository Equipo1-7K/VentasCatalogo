/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Métodos para usuarios
 */

const router = require("express").Router();
const Reportes = new (require("./Reportes_Controller"))();

/**
 * @swagger
 * /reportes/cobrosDelDia:
 *   get:
 *     tags:
 *      - Reportes
 *     summary: Obtener cobros del día
 *     description: Obtiene los cobros del día y vencidos, paginado.
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
 *         description: Los datos del usuario y el token de sesión
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Reportes_CobrosDia_Res'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/cobrosDelDia", Reportes.obtenerCobrosDia);

module.exports = router;