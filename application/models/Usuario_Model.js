const Mysql = require("promise-mysql");
const config = require("../../appConfig").database;

// Declaración de la clase
module.exports = (function() {
    
    function Usuario_Model() { }
    
    Usuario_Model.prototype.obtenerContrasenaPorCoreo = (correo) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                return mysqlConn.query("SELECT sal, contrasena FROM usuarios WHERE correo = ?", [
                    correo
                ]);
            }).then(results => {
                resolve(results);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Usuario_Model.prototype.obtenerParaLogin = (correo, contrasena) => {
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config).then(mysqlConn => {
                return mysqlConn.query("SELECT id, correo, nombre, apPAterno, apMaterno FROM usuarios WHERE correo = ? AND contrasena = ?", [
                    correo,
                    contrasena
                ]);
            }).then(usuario => {
                resolve(usuario);
            }).catch(err => {
                reject(err);
            })
        });
    }

    return Usuario_Model;
})();