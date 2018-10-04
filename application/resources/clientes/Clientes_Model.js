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
 */

const Mysql = require("promise-mysql");
const config = require("../../../appConfig").database;

// Declaración de la clase
module.exports = (function() {
    
    function Clientes() { }
    
    Clientes.prototype.agregar = (idUsuario, cliente) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                return mysqlConn.query("INSERT INTO clientes VALUES (NULL, ?, ?, ?, ?, DEFAULT, DEFAULT, NULL)", [
                    idUsuario,
                    cliente.nombre,
                    cliente.apPaterno,
                    cliente.apMaterno
                ]);
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }
    
    Clientes.prototype.obtenerPorId = (idUsuario, idCliente) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                return mysqlConn.query("SELECT * FROM clientes WHERE idUsuario = ? AND id = ? AND deletedAt IS NULL", [
                    idUsuario,
                    idCliente
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
    
    Clientes.prototype.obtenerPaginado = (idUsuario, page, perPage) => {
        const offset = (page - 1) * perPage;
        const limit = perPage;
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                return mysqlConn.query("SELECT * FROM clientes WHERE idUsuario = ? AND deletedAt IS NULL LIMIT ? OFFSET ?", [
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

    Clientes.prototype.obtenerTotal = (idUsuario) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                return mysqlConn.query("SELECT COUNT(*) AS total FROM clientes WHERE idUsuario = ? AND deletedAt IS NULL", [
                    idUsuario,
                ]);
            }).then(result => {
                resolve(result[0].total);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Clientes.prototype.modificar = (idUsuario, idCliente, cliente) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                return mysqlConn.query("UPDATE clientes SET nombre = ?, apPaterno = ?, apMaterno = ? WHERE id = ? AND idUsuario = ?", [
                    cliente.nombre,
                    cliente.apPaterno,
                    cliente.apMaterno,
                    idCliente,
                    idUsuario,
                ]);
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Clientes.prototype.eliminar = (idUsuario, idCliente) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                return mysqlConn.query("UPDATE clientes SET deletedAt = CURRENT_TIMESTAMP WHERE id = ? AND idUsuario = ?", [
                    idCliente,
                    idUsuario,
                ]);
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        })
    }

    return Clientes;
})();