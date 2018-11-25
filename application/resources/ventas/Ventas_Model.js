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
 *       cantProductos:
 *         type: number
 *       total:
 *         type: number
 *       abono:
 *         type: object
 *         properties:
 *           total:
 *             type: number
 *           deuda:
 *             type: number
 *           fechaSiguientePago:
 *             type: string
 *           cantidadSiguientePago:
 *             type: number
 *       status:
 *         type: string
 *         enum:
 *          - Sin Pago
 *          - Abonado
 *          - Pagado
 *          - Desconocido
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
 * 
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
 * 
 *   Venta_AbonoRealizado:
 *     type: object
 *     properties:
 *       idVenta:
 *         type: integer
 *       cantidad:
 *         type: number
 *       fecha:
 *         type: string
 * 
 *   Venta_AbonoGenerado:
 *     type: object
 *     properties:
 *       idVenta:
 *         type: integer
 *       consecutivo:
 *         type: number
 *       fechaAPagar:
 *         type: string
 *       cantidadAPagar:
 *         type: number
 *       pagado:
 *         type: number
 */

const Moment = require("moment");
const Pool = require("../../system/MysqlPool");
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
            Pool.query("INSERT INTO ventas VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT, NULL)", [
                idUsuario,
                venta.idCliente,
                venta.pago.tipo,
                venta.pago.acuerdo,
                venta.pago.cantidad,
                venta.pago.intervaloPago,
                venta.pago.fechaPrimerPago
            ]).then(result => {
                metaVenta = result;

                // Insertamos los productos
                return Promise.each(venta.productos, producto => {
                    return Pool.query("SELECT nombre, imagen, precio FROM productos WHERE id = ?", [
                        producto.idProducto
                    ]).then(datosProducto => {
                        datosProducto = datosProducto[0];
                        total += producto.cantidad * datosProducto.precio;

                        return Pool.query("INSERT INTO venta_productos VALUES (?, ?, ?, ?, ?, ?)", [
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
                const abonosGenerados = [];
                let fechaAPagar = Moment(venta.pago.fechaPrimerPago);

                // Generamos los abonos
                if (venta.pago.acuerdo === "Parcialidades") {
                    const abonoAcordado = total / venta.pago.cantidad; // Calculamos los pagos que se van a hacer

                    for (let i = 0; i < venta.pago.cantidad; i++) {
                        const insertQuery = 
                        `(
                            ${Pool.escape(metaVenta.insertId)},
                            ${Pool.escape(i + 1)},
                            ${Pool.escape(Moment(fechaAPagar).format("YYYY-MM-DD HH:mm:ss"))},
                            ${Pool.escape(abonoAcordado)},
                            0)`;
                        abonosGenerados.push(insertQuery);

                        fechaAPagar = Moment(fechaAPagar).add(venta.pago.intervaloPago, 'days');
                    }
                } else {
                    let i = 0;
                    while (total > 0) {
                        const insertQuery = 
                        `(
                            ${Pool.escape(metaVenta.insertId)},
                            ${Pool.escape(i + 1)},
                            ${Pool.escape(Moment(fechaAPagar).format("YYYY-MM-DD HH:mm:ss"))},
                            ${Pool.escape(total - venta.pago.cantidad > 0 ? venta.pago.cantidad : total)},
                            0)`;
                        abonosGenerados.push(insertQuery);

                        fechaAPagar = Moment(fechaAPagar).add(venta.pago.intervaloPago, 'days');
                        total -= venta.pago.cantidad;
                        i++;
                    }
                }

                return Pool.query("INSERT INTO venta_abonosGenerados VALUES " + abonosGenerados.join());
            }).then(result => {
                resolve(metaVenta);
            }).catch(err => {
                reject(err);
            });
        })
    }
    
    Ventas.prototype.obtenerPorId = (idUsuario, idVenta) => {
        return new Promise((resolve, reject) => {
            Pool.query("SELECT * FROM view_ventas WHERE idUsuario = ? AND id = ? AND deletedAt IS NULL", [
                    idUsuario,
                    idVenta
            ]).then(result => {
                if (result.length > 0) {
                    resolve(formatearVenta(result[0]));
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
            const queryString = 
            `SELECT *
            FROM view_ventas
            WHERE idUsuario = ? AND deletedAt IS NULL
            LIMIT ? OFFSET ?`;
            Pool.query(queryString, [
                idUsuario,
                limit,
                offset
            ]).then(result => {
                const ventas = [];
                result.forEach(venta => {
                    ventas.push(formatearVenta(venta));
                });
                resolve(ventas);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.obtenerTotal = (idUsuario) => {
        return new Promise((resolve, reject) => {
            const queryString = 
            `SELECT
                COUNT(*) AS total
            FROM ventas
            WHERE idUsuario = ? AND deletedAt IS NULL`;
            Pool.query(queryString, [
                idUsuario
            ]).then(result => {
                resolve(result[0].total);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.obtenerProductosPaginado = (idUsuario, idVenta, page, perPage) => {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * perPage;
            const limit = perPage;
            const queryString = 
            `SELECT
                vp.idProducto,
                vp.nombre,
                vp.imagen,
                vp.precio,
                vp.cantidad
            FROM venta_productos AS vp
                INNER JOIN ventas AS v ON v.id = vp.idVenta
            WHERE v.idUsuario = ? AND vp.idVenta = ? AND v.deletedAt IS NULL
            LIMIT ? OFFSET ?`;
            Pool.query(queryString, [
                idUsuario,
                idVenta,
                limit,
                offset
            ]).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.obtenerProductosTotal = (idUsuario, idVenta) => {
        return new Promise((resolve, reject) => {
            const queryString = 
            `SELECT
                COUNT(*) AS total
            FROM venta_productos AS vp
                INNER JOIN ventas AS v ON v.id = vp.idVenta
            WHERE v.idUsuario = ? AND vp.idVenta = ? AND v.deletedAt IS NULL`;
            Pool.query(queryString, [
                idUsuario,
                idVenta,
            ]).then(result => {
                resolve(result[0].total);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.eliminar = (idUsuario, idVenta) => {
        return new Promise((resolve, reject) => {
            const queryString = 
            `UPDATE ventas SET
                deletedAt = CURRENT_TIMESTAMP
            WHERE idUsuario = ? AND idVenta = ?`
            Pool.query(queryString, [
                idUsuario,
                idVenta,
            ]).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }
 
    Ventas.prototype.obtenerAbonosGeneradosPaginado = (idUsuario, idVenta, page, perPage) => {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * perPage;
            const limit = perPage;
            const queryString = 
            `SELECT vag.*
            FROM venta_abonosGenerados AS vag
                INNER JOIN ventas AS v ON v.id = vag.idVenta
            WHERE v.idUsuario = ? AND vag.idVenta = ? AND v.deletedAt IS NULL
            LIMIT ? OFFSET ?`;
            Pool.query(queryString, [
                idUsuario,
                idVenta,
                limit,
                offset
            ]).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }
 
    Ventas.prototype.obtenerAbonosGeneradosTotal = (idUsuario, idVenta) => {
        return new Promise((resolve, reject) => {
            const queryString = 
            `SELECT
                COUNT(*) AS total
            FROM venta_abonosGenerados AS vag
                INNER JOIN ventas AS v ON v.id = vag.idVenta
            WHERE v.idUsuario = ? AND vag.idVenta = ? AND v.deletedAt IS NULL`;
            Pool.query(queryString, [
                idUsuario,
                idVenta,
            ]).then(result => {
                resolve(result[0].total);
            }).catch(err => {
                reject(err);
            });
        })
    }
 
    Ventas.prototype.obtenerAbonosRealizadosPaginado = (idUsuario, idVenta, page, perPage) => {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * perPage;
            const limit = perPage;
            const queryString = 
            `SELECT var.*
            FROM venta_abonosRealizados AS var
                INNER JOIN ventas AS v ON v.id = var.idVenta
            WHERE v.idUsuario = ? AND var.idVenta = ? AND v.deletedAt IS NULL
            LIMIT ? OFFSET ?`;
            Pool.query(queryString, [
                idUsuario,
                idVenta,
                limit,
                offset
            ]).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }
 
    Ventas.prototype.obtenerAbonosRealizadosTotal = (idUsuario, idVenta) => {
        return new Promise((resolve, reject) => {
            const queryString = 
            `SELECT
                COUNT(*) AS total
            FROM venta_abonosRealizados AS vag
                INNER JOIN ventas AS v ON v.id = vag.idVenta
            WHERE v.idUsuario = ? AND vag.idVenta = ? AND v.deletedAt IS NULL`;
            Pool.query(queryString, [
                idUsuario,
                idVenta,
            ]).then(result => {
                resolve(result[0].total);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.obtenerRestantePorAbonarPorId = (idUsuario, idVenta) => {
        return new Promise((resolve, reject) => {
            const queryString = 
            `SELECT SUM(cantidadAPagar - pagado) AS restante
            FROM venta_abonosGenerados AS vag
                INNER JOIN ventas AS v ON v.id = vag.idVenta
            WHERE v.idUsuario = ? AND vag.idVenta = ? AND v.deletedAt IS NULL`;
            Pool.query(queryString, [
                idUsuario,
                idVenta
            ]).then(result => {
                resolve(result[0].restante);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Ventas.prototype.obtenerAbonoRealizadoPorId = (idUsuario, idAbonoRealizado) => {
        return new Promise((resolve, reject) => {
            const queryString = 
            `SELECT * FROM
                venta_abonosRealizados AS var
                    INNER JOIN ventas AS v ON var.idVenta = v.id
            WHERE
                v.idUsuario = ? AND
                var.id = ?`
            Pool.query(queryString, [
                idUsuario,
                idAbonoRealizado
            ]).then(result => {
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

    Ventas.prototype.agregarAbono = (idVenta, abono) => {
        const abonosAfectados = [];
        let abonoAgregado;

        return new Promise((resolve, reject) => {
            Pool.query("INSERT INTO venta_abonosRealizados VALUES (NULL, ?, ?, CURRENT_TIMESTAMP)", [
                idVenta,
                abono.cantidad
            ]).then(result => {
                abonoAgregado = result;
                return Pool.query("SELECT * from venta_abonosGenerados WHERE idVenta = ? AND pagado < cantidadAPagar", [
                    idVenta
                ])
            }).then(abonosGenerados => {
                for (index in abonosGenerados) {
                    // Aquí calculamos la cantidad de abonos que vamos a afectar
                    const cantidadAPagar = abonosGenerados[index].cantidadAPagar - abonosGenerados[index].pagado;
                    
                    if (cantidadAPagar < abono.cantidad) {
                        abonosAfectados.push({
                            consecutivo: abonosGenerados[index].consecutivo,
                            pagado: abonosGenerados[index].cantidadAPagar
                        });
                        abono.cantidad -= cantidadAPagar;
                    } else {
                        abonosAfectados.push({
                            consecutivo: abonosGenerados[index].consecutivo,
                            pagado: abonosGenerados[index].pagado + abono.cantidad
                        });
                        abono.cantidad = 0;
                    }

                    if (abono.cantidad == 0) break;
                }
                return new Promise.each(abonosAfectados, abono => {
                    const queryString = 
                    `UPDATE venta_abonosGenerados SET
                        pagado = ?
                    WHERE idVenta = ? AND consecutivo = ?`;
                    return Pool.query(queryString, [
                        abono.pagado,
                        idVenta,
                        abono.consecutivo
                    ]);
                })
            }).then(result => {
                resolve(abonoAgregado);
            }).catch(err => {
                reject(err)
            })
        })
    }

    return Ventas;
})();

const formatearVenta = (venta) => (
     {
        id: venta.id,
        idCliente: venta.idCliente,
        cantProductos: venta.cantidadProductos,
        total: venta.total,
        abono: {
            total: venta.abonado,
            deuda: venta.deuda,
            fechaSiguientePago: venta.fechaSiguientePago || undefined,
            cantidadSiguientePago: venta.cantidadSiguientePago || undefined
        },
        status: venta.status,
        pago: {
            tipo: venta.tipoPago,
            acuerdo: venta.tipoAcuerdo,
            cantidad: venta.cantidadAcuerdo,
            fechaPrimerPago: venta.fechaPrimerPago,
            intervaloPago: venta.intervaloPago
        }
    }
);