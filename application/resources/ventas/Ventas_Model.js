/**
 * @swagger
 * definitions:
 *   Venta:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       idCliente:
 *         type: integer
 *       pago:
 *         type: object
 *         properties:
 *           tipo:
 *             type: string
 *             enum:
 *              - Credito
 *              - Contado
 *           acuerdo:
 *             type: string
 *             enum:
 *              - Parcialidades
 *              - Dinero
 *           cantidad:
 *             type: number
 *           fechaPrimerPago:
 *             type: string
 *           intervaloPago:
 *              type: integer
 *   Venta_Productos:
 *     type: object
 *     properties:
 *       idProducto:
 *         type: integer
 *       nombre:
 *         type: integer
 *       imagen:
 *         type: string
 *       precio:
 *         type: number
 *       cantidad:
 *         type: number
 */

const Mysql = require("promise-mysql");
const config = require("../../../appConfig").database;
const Moment = require("moment");

// Declaración de la clase
module.exports = (function() {
    
    function Ventas() { }

    Ventas.prototype.agregar = (idUsuario, venta) => {
        let metaVenta;
        let total = 0;

        // Revisamos el caso de los abonos generados
        if (venta.pago.tipo === "Contado") { // Si es de contado, generamos un sólo abono que posteriormente se va a pagar
            venta.pago.acuerdo = "Parcialidades";
            venta.pago.cantidad = 1;
            venta.pago.fechaPrimerPago = Moment().format("YYYY-MM-DD HH:mm:ss");
        }

        return new Promise((resolve, reject) => {

            Mysql.createConnection(config).then(mysqlConn => {

                // Creamos la venta base
                return mysqlConn.query("INSERT INTO ventas VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT, NULL)", [
                    idUsuario,
                    venta.idCliente,
                    venta.pago.tipo,
                    venta.pago.acuerdo,
                    venta.pago.cantidad,
                    venta.pago.intervaloPago,
                    venta.pago.fechaPrimerPago
                ]);
            }).then(result => {
                metaVenta = result;
                return Mysql.createConnection(config);
            }).then(mysqlConn => {

                // Insertamos los productos
                return Promise.each(venta.productos, producto => {
                    return mysqlConn.query("SELECT nombre, imagen, precio FROM productos WHERE id = ?", [
                        producto.idProducto
                    ]).then(datosProducto => {
                        datosProducto = datosProducto[0];
                        total += producto.cantidad * datosProducto.precio;

                        return mysqlConn.query("INSERT INTO venta_productos VALUES (?, ?, ?, ?, ?, ?)", [
                            metaVenta.insertId,
                            producto.idProducto,
                            datosProducto.nombre,
                            datosProducto.imagen,
                            datosProducto.precio,
                            producto.cantidad
                        ])
                    })
                })

            }).then(result => {
                return Mysql.createConnection(config);
            }).then(mysqlConn => {
                const abonosGenerados = [];
                let fechaAPagar = Moment(venta.pago.fechaPrimerPago);

                // Generamos los abonos
                if (venta.pago.acuerdo === "Parcialidades") {
                    const abonoAcordado = total / venta.pago.cantidad; // Calculamos los pagos que se van a hacer

                    for (let i = 0; i < venta.pago.cantidad; i++) {
                        abonosGenerados.push({
                            idVenta: metaVenta.insertId,
                            consecutivo: i + 1,
                            fechaAPagar: Moment(fechaAPagar).format("YYYY-MM-DD HH:mm:ss"),
                            cantidadAPagar: abonoAcordado,
                            pagado: 0
                        });

                        fechaAPagar = Moment(fechaAPagar).add(venta.pago.intervaloPago, 'days');
                    }
                } else {
                    let i = 0;
                    while (total > 0) {
                        abonosGenerados.push({
                            idVenta: metaVenta.insertId,
                            consecutivo: i + 1,
                            fechaAPagar: Moment(fechaAPagar).format("YYYY-MM-DD HH:mm:ss"),
                            cantidadAPagar: (total - venta.pago.cantidad > 0 ? venta.pago.cantidad : total),
                            pagado: 0
                        });

                        fechaAPagar = Moment(fechaAPagar).add(venta.pago.intervaloPago, 'days');
                        total -= venta.pago.cantidad;
                        i++;
                    }
                }

                console.log("abonosGenerados" + JSON.stringify(abonosGenerados));
                // Insertamos los abonos generados
                return Promise.each(abonosGenerados, abono => {
                    return mysqlConn.query("INSERT INTO venta_abonosGenerados VALUES (?, ?, ?, ?, ?)", [
                        abono.idVenta,
                        abono.consecutivo,
                        abono.fechaAPagar,
                        abono.cantidadAPagar,
                        abono.pagado
                    ]);
                })
            }).then(result => {
                resolve(metaVenta);
            }).catch(err => {
                reject(err);
            });
        })
    }
    
    Ventas.prototype.obtenerPorId = (idUsuario, idVenta) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                return mysqlConn.query("SELECT * FROM ventas WHERE idUsuario = ? AND id = ? AND deletedAt IS NULL", [
                    idUsuario,
                    idVenta
                ]);
            }).then(result => {
                if (result.length > 0) {
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.obtenerPaginado = (idUsuario, page, perPage) => {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * perPage;
            const limit = perPage;
            Mysql.createConnection(config).then(mysqlConn => {
                const queryString = 
                `SELECT *
                FROM ventas
                WHERE idUsuario = ? AND deletedAt IS NULL
                LIMIT ? OFFSET ?`;
                return mysqlConn.query(queryString, [
                    idUsuario,
                    limit,
                    offset
                ]);
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.obtenerTotal = (idUsuario) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                const queryString = 
                `SELECT
                    COUNT(*) AS total
                FROM venta
                WHERE idUsuario = ? AND deletedAt IS NULL`;
                return mysqlConn.query(queryString, [
                    idUsuario
                ]);
            }).then(result => {
                resolve(result[0].total);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.obtenerProductosPorIdPaginado = (idUsuario, idVenta, page, perPage) => {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * perPage;
            const limit = perPage;
            Mysql.createConnection(config).then(mysqlConn => {
                const queryString = 
                `SELECT
                    v.idProducto,
                    v.nombre,
                    v.imagen,
                    v.precio,
                    v.cantidad,
                FROM venta_productos AS vp
                    INNER JOIN ventas AS v ON v.id = vp.idVenta
                WHERE v.idUsuario = ? AND vp.idVenta = ? AND v.deletedAt IS NULL
                LIMIT ? OFFSET ?`;
                return mysqlConn.query(queryString, [
                    idUsuario,
                    idVenta,
                    limit,
                    offset
                ]);
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.obtenerProductosPorIdTotal = (idUsuario, idVenta) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                const queryString = 
                `SELECT
                    COUNT(*) AS total
                FROM venta_productos AS vp
                    INNER JOIN ventas AS v ON v.id = vp.idVenta
                WHERE v.idUsuario = ? AND vp.idVenta = ? AND v.deletedAt IS NULL`;
                return mysqlConn.query(queryString, [
                    idUsuario,
                    idVenta,
                ]);
            }).then(result => {
                resolve(result[0].total);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.eliminar = (idUsuario, idVenta) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                const queryString = 
                `UPDATE ventas SET
                    deletedAt = CURRENT_TIMESTAMP
                WHERE idUsuario = ? AND idVenta = ?`
                return mysqlConn.query(queryString, [
                    idUsuario,
                    idVenta,
                ]);
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }
 
    return Ventas;
})();

const lawea = {
    idCliente: 1,
    pago: {
        tipo: ("Credito" || "Contado"),
        acuerdo: ("Parcialidades" || "Dinero"),
        cantidad: 5,
        fechaPrimerPago: "2018-10-04 12:00:00",
        intervaloPago: 15
    },
    productos: [
        {
            idProducto: 1,
            cantidad: 1
        }
    ]
}