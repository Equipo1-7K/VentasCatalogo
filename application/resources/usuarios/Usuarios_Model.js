const Pool = require("../../system/MysqlPool");

console.log(__dirname);

// Declaración de la clase
module.exports = (function() {
    
    function Usuarios_Model() { }

    Usuarios_Model.prototype.obtenerContrasenaPorCoreo = (correo) => {
        return new Promise((resolve, reject) => {
            Pool.query("SELECT sal, contrasena FROM usuarios WHERE correo = ?", [
                correo
            ]).then(results => {
                resolve(results);
            }).catch(err => {
                reject(err);
            });
        })
    }

    Usuarios_Model.prototype.obtenerParaLogin = (correo, contrasena) => {
        return new Promise((resolve, reject) => {
            Pool.query("SELECT id, correo, nombre, apPaterno, apMaterno FROM usuarios WHERE correo = ? AND contrasena = ?", [
                correo,
                contrasena
            ]).then(usuario => {
                resolve(usuario);
            }).catch(err => {
                reject(err);
            })
        });
    }

    Usuarios_Model.prototype.obtenerPorId = (idUsuario) => {
        return new Promise((resolve, reject) => {
            Pool.query("SELECT id, correo, nombre, apPaterno, apMaterno FROM usuarios WHERE id = ?", [
                idUsuario
            ]).then(usuario => {
                resolve(usuario[0]);
            }).catch(err => {
                reject(err);
            })
        });
    }

    Usuarios_Model.prototype.obtenerPorCorreo = (correo) => {
        return new Promise((resolve, reject) => {
            Pool.query("SELECT id, correo, nombre, apPaterno, apMaterno FROM usuarios WHERE correo = ?", [
                correo
            ]).then(usuario => {
                resolve(usuario);
            }).catch(err => {
                reject(err);
            })
        });
    }

    Usuarios_Model.prototype.crear = (usuarioNuevo) => {
        return new Promise((resolve, reject) => {
            Pool.query("INSERT INTO usuarios VALUES (NULL, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT, NULL)", [
                usuarioNuevo.correo,
                usuarioNuevo.nombre,
                usuarioNuevo.apPaterno,
                usuarioNuevo.apMaterno,
                usuarioNuevo.contrasena,
                usuarioNuevo.sal
            ]).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        })
    }

    return Usuarios_Model;
})();