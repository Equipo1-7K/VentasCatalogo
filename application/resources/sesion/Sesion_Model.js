const Mysql = require("promise-mysql");
const UUID = require("uuid/v4");
const config = __appconfig.database;
const Pool = require("../../system/MysqlPool");

// Declaración de la clase
module.exports = (function() {    

    function Sesion_Model() { }

    Sesion_Model.prototype.iniciarSesion = (usuario) => {
        // Obtenemos el usuario
        token = UUID();
        return new Promise((resolve, reject) => {
            Pool.query("INSERT INTO sesiones VALUES (?, ?, DEFAULT, DEFAULT)", [
                token,
                usuario.id
            ]).then(() => {
                usuario.token = token;
                resolve(usuario);
            }).catch(err => {
                reject(err);
            })
        });
    }

    Sesion_Model.prototype.cerrarSesion = (token) => {
        return new Promise((resolve, reject) => {
            Pool.query("UPDATE sesiones SET fechaCierre = CURRENT_TIMESTAMP WHERE token = ? AND fechaCierre IS NULL", [
                token
            ]).then(result => {
                if (result.affectedRows > 0) { // Si efectivamente se cerró una sesión
                    resolve({status: "ok", message: "La sesión ha sido cerrada con éxito"})
                } else { // Si no, pos no pues..
                    reject({status: "exception", message: "La sesión no es válida"})
                }
            }).catch(err => { // Para este punto, todo se murió
                reject({status: "error", message: err});
            });
        });
    }

    Sesion_Model.prototype.verificarSesion = (token) => {
        return new Promise((resolve, reject) => {
            Pool.query("SELECT idUsuario FROM sesiones WHERE token = ? AND fechaCierre IS NULL", [
                token
            ]).then(result => {
                if (result.length > 0) {
                    resolve(result[0]);
                } else {
                    reject({status: "exception", message: "Sesión inválida"});
                }
            }).catch(err => {
                reject({status: "exception", message: err});
            })
        })
    }

    return Sesion_Model;
})();