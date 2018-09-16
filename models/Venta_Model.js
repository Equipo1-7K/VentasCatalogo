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
 *           $ref: '#/definitions/ProductosVenta'
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
 *           totalVenta:
 *             type: Number
 *           totalAbono:
 *             type: Number
 *           abonosRealizados:
 *             type: array
 *             items:
 *               type: object
 *               $ref: "#/definitions/Abono"
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
 *           $ref: '#/definitions/ProductosVenta'
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
const ProductosVenta_Model = require("./ProductoVenta_Model")

const Venta = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clientes",
        required: true
    },
    productos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductosVenta",
        required: true
    }],
    pago: {
        totalVenta: {
            type: Number,
            default: 0
        },
        totalAbonado: {
            type: Number,
            default: 0
        },
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Abonos",
            required: false
        }],
    }
});

Venta.statics.obtenerPorId = function(id) {
    const db = this;

    return new Promise((resolve, reject) => {
        db.findOne({_id: id})
            .populate("cliente")
            .populate({
                path: "productos.producto",
                model: "Productos"
            })
            .then((producto) => { resolve(producto); })
            .catch((err) => { reject(err); });
    });
};

Venta.statics.obtenerPorUsuario = function(id) {
    return new Promise((resolve, reject) => {
        Usuario_Model
            .findOne({_id: id})
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

    // return new Promise((resolve, reject) => {
    //     db.create(venta)
    //         .then((venta) => {
    //             Ventas_Model.obtenerPorId(venta._id)
    //                 .then((venta) => {
    //                     venta.pago.totalVenta = 0.0;
    //                     venta.productos.forEach((producto, index, arr) => {
    //                         console.log(producto);
    //                         arr[index].importe =  producto.cantidad * producto.producto.precio
    //                         venta.pago.totalVenta += arr[index].importe;
    //                     });
    //                     if (venta.pago.tipo === "Contado") {
    //                         venta.pago.totalAbonado = venta.pago.totalVenta;
    //                     }
    //                     venta.save()
    //                         .then((venta) => {
    //                             resolve(venta);
    //                         })
    //                         .catch((err) => {
    //                              reject(err); 
    //                         });
    //                         Usuario_Model.asociarVenta(idUsuario, venta.id)
    //                             .then(() => {
    //                                 db.findOne({ _id: venta.id })
    //                                     .populate("clientes")
    //                                     .populate("productos.producto")
    //                                     .then((venta) => { resolve(venta); })
    //                                     .catch((err) => { reject(err); });
    //                             })
    //                             .catch((err) => {
    //                                 reject(err); 
    //                             });
    //                     })
    //                     .catch((err) => {
    //                         reject(err);
    //                     });
    //         })
    //         .catch((err) => {
    //             reject(err);
    //         });
    // });

    return new Promise((resolve, reject) => {
        // Aislamos los productos
        const productos = venta.productos;
        delete venta.productos;

        // Creamos la venta
        db.create(venta)
            .then((venta) => {
                // Calculamos el total para cada producto y la venta en general
                venta.pago.totalVenta = 0.0;
                productos.forEach((producto, index, arr) => {
                    arr[index].importe =  producto.cantidad * producto.producto.precio;
                    venta.pago.totalVenta += arr[index].importe;
                    arr[index].venta = venta._id;
                });

                // Si es de contado, agregamos un abono por el total
                if (venta.pago.tipo === "Contado") {
                    Venta.statics.abonar(venta._id, venta.pago.totalVenta);
                }

                // Agregamos cada uno de los productos
                ProductosVenta_Model.agregarVarios(productos)
                    .then((productos) => {
                        // Obtenemos los ids de los productos agregados
                        const ids = productos.map((producto) => {
                            return producto._id;
                        });

                        // Asociamos los IDs de los productos agregados a la venta
                        venta.productos = ids;
                        venta.save()
                            .then((venta) => {
                                resolve(venta);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
            .catch((err) => {
                reject(err);
            })

    });
};

Venta.statics.abonar = function(idVenta, cantidad) {
    const db = this;

    return new Promise((resolve, reject) => {
        db.findOneAndUpdate({
            _id: id
        }, {
            $push: {
                productos: mongoose.Types.ObjectId(idProducto)
            },
            "pago.totalAbonado"
        }, {
            new: true
        }).then((usuario) => {
            resolve(usuario);
        }).catch((err) => {
            reject(err);
        });
    });
};

Venta.plugin(MetaFields);

const Ventas_Model = mongoose.model("Ventas", Venta);
module.exports = Ventas_Model;