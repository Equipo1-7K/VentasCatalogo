/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Métodos para clientes
 */

const router = require("express").Router();

// Controlador base
const Clientes = new (require("./Clientes_Controller"))();

/**
 * @swagger
 * /clientes:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Clientes
 *     summary: Obtiene clientes paginados
 *     description: Obtiene una página de los clientes correspondientes al usuario con la sesión iniciada
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
 *         description: La lista paginada de los clientes
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Cliente_ObtenerPaginado_Res'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/", Clientes.obtenerPaginado);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Clientes
 *     summary: Obtiene un cliente por su ID
 *     description: Obtiene un cliente a partir de su ID
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: ID del cliente
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: El producto seleccionado
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Cliente'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/:id", Clientes.obtenerPorId);

/**
 * @swagger
 * /clientes:
 *   post:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Clientes
 *     summary: Crear Clientes
 *     description: Crea un cliente con los datos ingresados
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: body
 *         description: Datos del cliente nuevo
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Cliente_Agregar_Req'
 *     responses:
 *       201:
 *         description: El cliente nuevo
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Cliente'
 *       default:
 *         $ref: "#/responses/default"
 */
router.post("/", Clientes.agregar);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Clientes
 *     summary: Modificar Clientes
 *     description: Sustituye un cliente señalado por su ID por otro enviado desde el body
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: ID del cliente
 *         in: path
 *         required: true
 *         type: number
 *       - name: body
 *         description: Datos del cliente nuevo
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Cliente_Modificar_Req'
 *     responses:
 *       204:
 *         description: Nada xd
 *       default:
 *         $ref: "#/responses/default"
 */
router.put("/:id", Clientes.modificar);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Clientes
 *     summary: Elimina un Cliente
 *     description: Elimina un cliente a partir de su ID
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: ID del cliente
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
router.delete("/:id", Clientes.eliminar);


// Método no admitido
const HttpResponse = require("../../system/HttpResponse");
router.use((req, res) => {
    const response = new HttpResponse(res);
    response.methodNotAllowed({
        message: `El método ${req.method} no está disponible para esta ruta`
    });
});

module.exports = router;