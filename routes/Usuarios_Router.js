/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Métodos para usuario
 */

const router = require("express").Router();
const Usuarios_Controller = new (require("../controllers/Usuarios_Controller"))();

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener usuario por id
 *     description: Obtiene los datos de un usuario por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del usuario a obtener
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: El usuario a buscar
 *         type: object
 *         allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   $ref: '#/definitions/Usuario'
 */
router.get("/:id", Usuarios_Controller.obtener);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Registrar usuario
 *     description: Registra un usuario nuevo a partir de sus datos
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Cuerpo de la solicitud
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/UsuarioNuevo'
 *     responses:
 *       200:
 *         description: El usuario agregado
 */
router.post("/", Usuarios_Controller.registrar);

/**
 * @swagger
 * /destinos/{id}:
 *   put:
 *     tags:
 *       - Destinos
 *     summary: Modificar destino
 *     description: Modifica un destino
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id del destino
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         description: Cuerpo de la solicitud
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/DestinoNuevo'
 *     responses:
 *       200:
 *         description: El tipo de tag modificado
 */
// router.put("/:id", Usuarios_Controller.modificar);

/**
 * @swagger
 * /destinos/{id}:
 *   delete:
 *     tags:
 *       - Destinos
 *     summary: Eliminar destino
 *     description: Elimina un destino
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Id del tipo de tag
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: El tipo de tag eliminado
 */
// router.delete("/:id", Usuarios_Controller.eliminar);

module.exports = router;