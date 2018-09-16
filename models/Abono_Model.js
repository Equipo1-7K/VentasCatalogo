/**
 * @swagger
 * definitions:
 *   Abono:
 *     type: object
 *     properties:
 *       meta:
 *         type: object
 *         $ref: '#/definitions/Meta'
 *       _id:
 *         type: string
 *       fecha:
 *         type: string
 *       cantidad:
 *         type: number
 *       pedido:
 *         type: string
 * 
 *   AbonoNuevo:
 *     type: object
 *     required:
 *      - fecha
 *      - cantidad
 *     properties:
 *       fecha:
 *         type: string
 *       cantidad:
 *         type: number
 */

const mongoose = require("mongoose");
const MetaFields = require("../system/MetaFields");

const Abono = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    venta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ventas",
        required: true
    }
});

Venta.plugin(MetaFields);

module.exports = mongoose.Model("Abonos", Abono);