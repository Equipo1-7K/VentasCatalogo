/**
 * @swagger
 * definitions:
 *   Producto:
 *     type: object
 *     properties:
 *       meta:
 *         type: object
 *         $ref: '#/definitions/Meta'
 *       _id:
 *         type: string
 *       nombre:
 *         type: string
 *       descripcion:
 *         type: string
 *       precio:
 *         type: number
 *       imagen:
 *         type: string
 *   ProductoNuevo:
 *     type: object
 *     required:
 *      - nombre
 *      - descripcion
 *      - precio
 *      - imagen
 *     properties:
 *       nombre:
 *         type: string
 *       descripcion:
 *         type: string
 *       precio:
 *         type: number
 *       imagen:
 *         type: string
 */

const mongoose = require("mongoose");
const MetaFields = require("../system/MetaFields");
const Usuario_Model = require("./Usuario_Model");

const Producto = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
});

Producto.statics.obtenerPorId = function(id) {
    const db = this;

    return new Promise((resolve, reject) => {
        db.findOne({_id: id})
            .then((producto) => { resolve(producto); })
            .catch((err) => { reject(err); });
    });
}

Producto.statics.obtenerPorUsuario = function(id) {
    return new Promise((resolve, reject) => {
        Usuario_Model.findOne({_id: id})
            .select({_id: false, productos: true})
            .populate("productos")
            .then((productos) => { resolve(productos.productos); })
            .catch((err) => { reject(err); })
    });
}

Producto.statics.agregarProducto = function(idUsuario, producto) {
    const db = this;

    console.log(producto);

    return new Promise((resolve, reject) => {
        db.create(producto)
            .then((producto) => {
                Usuario_Model.asociarProducto(idUsuario, producto.id)
                    .then(() => { resolve(producto); })
                    .catch((err) => { reject(err); })
            })
            .catch((err) => {
                reject(err)
            })
    });
}

Producto.plugin(MetaFields);

module.exports = mongoose.model("Productos", Producto);