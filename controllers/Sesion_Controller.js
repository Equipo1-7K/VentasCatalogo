const Usuario_Model = require("../models/Usuario_Model");
const Sesion_Model = require("../models/Sesion_Model");
const HttpReponse = require("../system/HttpResponse");
const sha256 = require("js-sha256");
const DataValidator = require("../system/Validator");

const Sesion_Controller = (function() {
    function Sesion_Controller() {}
    
    Sesion_Controller.prototype.iniciarSesion = (req, res) => {
        let response = new HttpReponse(res);

        DataValidator.validate([
            {fieldName: "correo", value: req.body.correo, validator: "Email", required: true},
            {fieldName: "contrasena", value: req.body.contrasena, validator: "String", required: true}
        ]).then((data) => {
            // Buscamos el usuario correspondiente al correo
            Usuario_Model.findOne({correo: data.correo})
                .then((usuario) => {
                    // Si el usuario existe
                    if (usuario) {
                        // Hasheamos la contraseña
                        data.contrasena = sha256(usuario.sal + data.contrasena);
                        // Buscamos al usuario con la contraseña hasheada
                        Usuario_Model.findOne({
                            correo: data.correo,
                            contrasena: data.contrasena
                        }).select({
                            meta: false,
                            contrasena: false,
                            sal: false,
                            productos: false,
                            clientes: false
                        }).then((usuario) => {
                            // Si la contraseña es correcta
                            if (usuario) {
                                Sesion_Model.iniciarSesion(usuario)
                                    .then((sesion) => {
                                        response.success(sesion);
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        response.error(err);
                                    });
                            } else {
                                // Si no es correcta, lo notificamos
                                response.unauthorized({
                                    message: "Usuario y/o contraseña incorrectos",
                                    data: data.correo
                                });
                            }
                        }).catch((err) => {
                            console.error(err);
                            response.error("Ocurrió un error al iniciar sesión");
                        });
                    } else {
                        // Si no se encuentra el usuario, notificamos usuario y contraseña incorrectos
                        response.unauthorized({
                            message: "Usuario y/o contraseña incorrectos",
                            data: data.correo
                        });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    response.error("Ocurrió un error al iniciar sesión");
                });
        }).catch((err) => {
            console.log(err);
            response.badRequest(err);
        });
    };

    Sesion_Controller.prototype.verificarSesion = (req, res, next) => {
        let response = new HttpReponse(res);
        DataValidator.validate([
            {fieldName: "token", value: req.headers.authorization, validator: "String", required: true}
        ]).then((data) => {
            Sesion_Model.findOne({token: data.token, vigente: true})
                .then((sesion) => {
                    if (!sesion) {
                        response.unauthorized({
                            message: "Token inválido"
                        });
                    } else {
                        Sesion_Model.verificarSesion(sesion)
                            .then((sesion) => {
                                req.user = sesion.payload;
                                next();
                            })
                            .catch(() => {
                                Sesion_Model.cerrarSesion(data.token)
                                    .then(() => {
                                        response.unauthorized({
                                            message: "Token expirado"
                                        });
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        response.error(err);
                                    });
                            });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    response.error(err);
                });
        }).catch((err) => {
            if (err.token === undefined) {
                response.badRequest({
                    message: "Servicio protegido por token, inicie sesión antes de continuar"
                });
            } else {
                response.badRequest(err);
            }
        });
    };

    Sesion_Controller.prototype.verificarSesionManual = (req, res) => {
        const response = new HttpReponse(res);
        response.success(req.user);
    };

    Sesion_Controller.prototype.cerrarSesion = (req, res) => {
        let response = new HttpReponse(res);

        DataValidator.validate([
            {fieldName: "token", value: req.body.token, validator: "String", required: true}
        ]).then((data) => {
            Sesion_Model.cerrarSesion(data.token)
                .then((sesionCerrada) => {
                    response.success({
                        message: "Sesion cerrada con éxito",
                        data: sesionCerrada
                    });
                })
                .catch((err) => {
                    console.error(err);
                    response.error(err);
                });
        }).catch((err) => {
            console.error(err);
            response.error(err);
        });
    };

    return Sesion_Controller;
})();

module.exports = Sesion_Controller;