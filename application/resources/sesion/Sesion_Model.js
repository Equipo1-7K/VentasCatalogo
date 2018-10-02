const Mysql = require("promise-mysql");
const config = require("../../../appConfig").database;

const tokenHelper = require("../../system/TokenHelper");

// Declaración de la clase
module.exports = (function() {    

    function Sesion_Model() { }

    Sesion_Model.prototype.iniciarSesion = (usuario) => {
        // Obtenemos el usuario
        return new Promise((resolve, reject) => {
            const token = tokenHelper.createToken(usuario);
            Mysql.createConnection(config).then((mysqlConn) => {
                return mysqlConn.query("INSERT INTO sesiones VALUES (?, ?, DEFAULT, NULL)", [
                    token,
                    usuario.id
                ]);
            }).then(result => {
                usuario.token = token;
                resolve(usuario);
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