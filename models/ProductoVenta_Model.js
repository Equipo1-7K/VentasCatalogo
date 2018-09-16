/**
 * @swagger
 * definitions:
 *   ProductoVenta:
 *     type: object
 *     properties:
 *       producto:
 *         type: object
 *         $ref: '#/definitions/Producto'
 *       cantidad:
 *         type: number
 *       importe:
 *         type: number
 */

const mongoose = require("mongoose");

const ProductoVenta = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Productos",
        required: true
    },
    venta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ventas",
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    importe: {
        type: Number,
        required: true
    },
});

ProductoVenta.statics.agregarVarios = function(productos) {
    const db = this;

    return new Promise((resolve, reject) => {
        db.insertMany(productos)
            .then((productos) => { resolve(productos); })
            .catch((err) => { reject(err); });
    });
}

module.exports = mongoose.Model("ProductosVenta", ProductoVenta);