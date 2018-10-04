/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Métodos para productos
 */

const router = require("express").Router();

// Controlador base
const Productos = new (require("./Productos_Controller"))();

/**
 * @swagger
 * /productos:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Productos
 *     summary: Obtiene productos paginados
 *     description: Obtiene una página de los productos correspondientes al usuario con la sesión iniciada
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
 *         description: El producto nuevo
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Producto'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/", Productos.obtenerPaginado);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Productos
 *     summary: Obtiene un producto por su ID
 *     description: Obtiene un producto a partir de su ID
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: ID del producto
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: El producto nuevo
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Producto'
 *       400:
 *         $ref: "#/responses/badRequest"
 *       default:
 *         $ref: "#/responses/default"
 */
router.get("/:id", Productos.obtenerPorId);

/**
 * @swagger
 * /productos:
 *   post:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Productos
 *     summary: Crear Productos
 *     description: Crea un producto con los datos ingresados
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: body
 *         description: Datos del producto nuevo
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Producto_Agregar_Req'
 *     responses:
 *       201:
 *         description: El producto nuevo
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Producto'
 *       default:
 *         $ref: "#/responses/default"
 */
router.post("/", Productos.agregar);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Productos
 *     summary: Modificar Productos
 *     description: Sustituye un producto señalado por su ID por otro enviado desde el body
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: ID del producto
 *         in: path
 *         required: true
 *         type: number
 *       - name: body
 *         description: Datos del producto nuevo
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Producto_Modificar_Req'
 *     responses:
 *       204:
 *         description: Nada xd
 *       default:
 *         $ref: "#/responses/default"
 */
router.put("/:id", Productos.modificar);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     security:
 *       - JWT: []
 *     tags:
 *      - Productos
 *     summary: Elimina un Producto
 *     description: Elimina un producto a partir de su ID
 *     produces:
 *      - application/json
 *     consumes:
 *      - application/json
 *      - application/x-www-form-urlencoded
 *     parameters:
 *       - name: id
 *         description: ID del producto
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
router.delete("/:id", Productos.eliminar);


// Método no admitido
const HttpResponse = require("../../system/HttpResponse");
router.use((req, res) => {
    const response = new HttpResponse(res);
    response.methodNotAllowed({
        message: `El método ${req.method} no está disponible para esta ruta`
    });
});

module.exports = router;