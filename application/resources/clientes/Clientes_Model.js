/**
 * @swagger
 * definitions:
 *   Cliente:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       idUsuario:
 *         type: integer
 *       nombre:
 *         type: string
 *       apPaterno:
 *         type: string
 *       apMaterno:
 *         type: string
 *       telefono:
 *         type: string
 *       domicilio:
 *         type: object
 *         properties:
 *           estado:
 *             type: string
 *           municipio:
 *             type: string
 *           cp:
 *             type: string
 *           colonia:
 *             type: string
 *           calle:
 *             type: string
 *           noExterno:
 *             type: string
 *           noInterno:
 *             type: string
 *           referencia:
 *             type: string
 *           
 */

const Pool = require('../../system/MysqlPool')

// Declaración de la clase
module.exports = (function() {
    
    function Clientes() { }
    
    Clientes.prototype.agregar = (idUsuario, cliente) => {
        return new Promise((resolve, reject) => {
            let metaResult;

            Pool.query("INSERT INTO clientes VALUES (NULL, ?, ?, ?, ?, DEFAULT, DEFAULT, NULL)", [
                idUsuario,
                cliente.nombre,
                cliente.apPaterno,
                cliente.apMaterno
            ]).then(result => {
                metaResult = result;
                return Pool.query("INSERT INTO cliente_domicilio VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT, NULL )", [
                    metaResult.insertId,
                    cliente.domicilio.estado,
                    cliente.domicilio.municipio,
                    cliente.domicilio.cp,
                    cliente.domicilio.colonia,
                    cliente.domicilio.calle,
                    cliente.domicilio.noExterno,
                    cliente.domicilio.noInterno,
                    cliente.domicilio.referencia
                ])
            }).then(result => {
                resolve(metaResult)
            }).catch(err => {
                reject(err);
            });
        })
    }
    
    Clientes.prototype.obtenerPorId = (idUsuario, idCliente) => {
        return new Promise((resolve, reject) => {
            Pool.query("SELECT * FROM clientes WHERE idUsuario = ? AND id = ? AND deletedAt IS NULL", [
                idUsuario,
                idCliente
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
    
    Clientes.prototype.obtenerDomicilioPorId = (idUsuario, idCliente) => {
        return new Promise((resolve, reject) => {
            Pool.query("SELECT cd.* FROM cliente_domicilio AS cd INNER JOIN clientes AS c on c.id = cd.idCliente WHERE c.idUsuario = ? AND cd.idCliente = ? AND c.deletedAt IS NULL", [
                idUsuario,
                idCliente
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
    
    Clientes.prototype.obtenerPaginado = (idUsuario, page, perPage) => {
        const offset = (page - 1) * perPage;
        const limit = perPage;
        return new Promise((resolve, reject) => {
            Pool.query("SELECT * FROM clientes WHERE idUsuario = ? AND deletedAt IS NULL LIMIT ? OFFSET ?", [
                idUsuario,
                limit,
                offset
            ]).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Clientes.prototype.obtenerTotal = (idUsuario) => {
        return new Promise((resolve, reject) => {
            Pool.query("SELECT COUNT(*) AS total FROM clientes WHERE idUsuario = ? AND deletedAt IS NULL", [
                idUsuario,
            ]).then(result => {
                resolve(result[0].total);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Clientes.prototype.modificar = (idUsuario, idCliente, cliente) => {
        return new Promise((resolve, reject) => {
            Pool.query("UPDATE clientes SET nombre = ?, apPaterno = ?, apMaterno = ? WHERE id = ? AND idUsuario = ?", [
                cliente.nombre,
                cliente.apPaterno,
                cliente.apMaterno,
                idCliente,
                idUsuario,
            ]).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Clientes.prototype.modificarDomicilio = (idCliente, domicilio) => {
        return new Promise((resolve, reject) => {
            const queryString = 
            `UPDATE cliente_domicilio SET
                estado = ?,
                municipio = ?,
                cp = ?,
                colonia = ?,
                calle = ?,
                noExterno = ?,
                noInterno = ?,
                referencia = ?
            WHERE idCliente = ?`;
            Pool.query(queryString, [
                domicilio.estado,
                domicilio.municipio,
                domicilio.cp,
                domicilio.colonia,
                domicilio.calle,
                domicilio.noExterno,
                domicilio.noInterno,
                domicilio.referencia,
                idCliente
            ]).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Clientes.prototype.eliminar = (idUsuario, idCliente) => {
        return new Promise((resolve, reject) => {
            Pool.query("UPDATE clientes SET deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND idUsuario = ?", [
                idCliente,
                idUsuario,
            ]).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }

    return Clientes;
})();