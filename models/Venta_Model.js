/**
 * @swagger
 * definitions:
 *   Venta:
 *     type: object
 *     properties:
 *       meta:
 *         type: object
 *         $ref: '#/definitions/Meta'
 *       _id:
 *         type: string
 *       cliente:
 *         type: object
 *         $ref: '#/definitions/Cliente'
 *       productos:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             producto:
 *               type: object
 *               $ref: '#/definitions/Producto'
 *             cantidad:
 *               type: number
 *       pago:
 *         type: object
 *         properties:
 *           tipo:
 *             type: string
 *             enum:
 *              - Credito
 *              - Contado
 *           abonoAcordado:
 *             type: number
 *           plazo:
 *             type: integer
 *           fechaInicio:
 *             type: string
 *           abonosRealizados:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 fecha:
 *                   type: string
 *                 cantidad:
 *                   type: number
 *   VentaNuevo:
 *     type: object
 *     required:
 *      - cliente
 *      - productos
 *      - pago
 *     properties:
 *       cliente:
 *         type: string
 *         match: '^[\da-fA-F]{24}$'
 *       productos:
 *         type: array
 *         items:
 *           type: object
 *           required:
 *            - producto
 *            - cantidad
 *           properties:
 *             producto:
 *               type: string
 *               match: '^[\da-fA-F]{24}$'
 *             cantidad:
 *               type: number
 *       pago:
 *         type: object
 *         required:
 *          - tipo
 *         properties:
 *           tipo:
 *             type: string
 *             enum:
 *              - Credito
 *              - Contado
 *           abonoAcordado:
 *             type: number
 *           plazo:
 *             type: integer
 */

const mongoose = require("mongoose");
const MetaFields = require("../system/MetaFields");
const Usuario_Model = require("./Usuario_Model");

const Venta = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clientes",
        required: true
    },
    productos: [{
        type: new mongoose.Schema({
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Productos",
                required: true
            },
            cantidad: {
                type: Number,
                required: true
            }
        }, {_id: false}),
        required: true
    }],
    pago: {
        tipo: {
            type: String,
            enum: ["Credito", "Contado"],
            required: true
        },
        abonoAcordado: {
            type: Number,
            required: false
        },
        plazo: {
            type: Number,
            required: false
        },
        fechaInicio: {
            type: Date,
            required: false
        },
        abonosRealizados: [{
            type: new mongoose.Schema({
                fecha: {
                    type: Date,
                    required: true
                },
                cantidad: {
                    type: Number,
                    required: true
                }
            }, {_id: false}),
            required: false
        }],
    }
});

Venta.statics.obtenerPorId = function(id) {
    const db = this;

    return new Promise((resolve, reject) => {
        db.findOne({_id: id})
            .then((producto) => { resolve(producto); })
            .catch((err) => { reject(err); });
    });
};

Venta.statics.obtenerPorUsuario = function(id) {
    return new Promise((resolve, reject) => {
        Usuario_Model.findOne({_id: id})
            .select({_id: false, ventas: true})
            .populate({
                path: "ventas",
                populate: {
                    path: "cliente productos.producto"
                }
            })
            .then((ventas) => {
                resolve(ventas.ventas); 
            })
            .catch((err) => { reject(err); });
    });
};

Venta.statics.agregar = function(idUsuario, venta) {
    const db = this;

    console.log(venta);

    return new Promise((resolve, reject) => {
        db.create(venta)
            .then((venta) => {
                Usuario_Model.asociarVenta(idUsuario, venta.id)
                    .then(() => {
                        db.findOne({ _id: venta.id })
                            .populate("clientes")
                            .populate("productos.producto")
                            .then((venta) => { resolve(venta); })
                            .catch((err) => { reject(err); });
                    })
                    .catch((err) => {
                        reject(err); 
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

Venta.plugin(MetaFields);

module.exports = mongoose.model("Ventas", Venta);