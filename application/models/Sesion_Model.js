const Mysql = require("promise-mysql");
const config = require("../../appConfig").database;

// Declaración de la clase
module.exports = (function() {    

    function Sesion_Model() { }

    Sesion_Model.prototype.iniciarSesion = (correo, contrasena) => {
        // Obtenemos el usuario
        return new Promise((resolve, reject) => {
            Mysql.createConnection(config)
            .then((mysqlConn) => {
                mysqlConn.query("SELECT sal, contrasena FROM usuarios WHERE correo = ?", [
                    correo
                ]);
            }).then(results => {
                // Control de errores
                if (results.length == 0) throw { error: "Usuario y/o contraseña incorrecto(s)" }

                const contrasenaSalada = results[0].sal + contrasena;
                return mysqlConn.query("SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?" [
                    correo,
                    contrasenaSalada
                ]);
            }).then(usuario => {
                // Control de errores
                if (usuario.length == 0) throw { error: "Usuario y/o contraseña incorrecto(s)" }
                
                resolve(usuario[0]);
            }).catch(err => {
                reject(err);
            })
        })
    }

    Sesion_Model.prototype.verificarSesion = () => {

    }

    Sesion_Model.prototype.cerrarSesion = () => {

    }

    return Sesion_Model;

})();