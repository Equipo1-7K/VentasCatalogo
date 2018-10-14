const Usuario_Model = require("../models/Usuario_Model");
const HttpReponse = require("../system/HttpResponse");
const DataValidator = require("../system/Validator");

const Usuarios_Controller = (function() {
    function Usuarios_Controller() {}
    
    Usuarios_Controller.prototype.obtener = (req, res) => {
        let response = new HttpReponse(res);

        DataValidator.validate([
            {fieldName: "id", value: req.params.id, validator: "MongoID", required: true}
        ]).then((data) => {
            Usuario_Model.obtenerPorId(data.id)
                .then((data) => {
                    response.success(data);
                })
                .catch((err) => {
                    response.error(err);
                });
        }).catch((err) => {
            console.log(err);
            response.badRequest(err);
        });
    };
    
    Usuarios_Controller.prototype.registrar = (req, res) => {
        let response = new HttpReponse(res);

        DataValidator.validate([
            {fieldName: "correo", value: req.body.correo, validator: "Email", required: true},
            {fieldName: "nombre", value: req.body.nombre, validator: "String", required: true},
            {fieldName: "apPaterno", value: req.body.apPaterno, validator: "String", required: true},
            {fieldName: "apMaterno", value: req.body.apMaterno, validator: "String", required: true},
            {fieldName: "contrasena", value: req.body.contrasena, validator: "String", required: true}
        ]).then((data) => {
            Usuario_Model.registrar(data)
                .then((data) => {
                    response.success(data);
                })
                .catch((err) => {
                    response.error(err);
                });
        }).catch((err) => {
            response.badRequest(err);
        });
    };

    return Usuarios_Controller;

})();

module.exports = Usuarios_Controller;