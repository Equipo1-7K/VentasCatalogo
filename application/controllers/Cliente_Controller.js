const HttpReponse = require("../system/HttpResponse");
const DataValidator = require("../system/Validator");
const Cliente_Model = require("../models/Cliente_Model");

const Cliente_Controller = (function() {
    function Cliente_Controller() {}

    Cliente_Controller.prototype.obtenerPorId = (req, res) => {
        const response = new HttpReponse(res);
        DataValidator.validate([
            {fieldName: "id", value: req.params.id, validator: "MongoID", required: true},
        ]).then((data) => {
            Cliente_Model.obtenerPorId(data.id)
                .then((cliente) => { response.success(cliente); })
                .catch((err) => { response.error(err); });
        }).catch((err) => {
            response.badRequest(err);
        });
    };

    Cliente_Controller.prototype.obtenerPorUsuario = (req, res) => {
        const response = new HttpReponse(res);

        Cliente_Model.obtenerPorUsuario(req.user._id)
            .then((clientes) => {
                response.success(clientes); 
            })
            .catch((err) => {
                response.error(err);
            });
    };

    Cliente_Controller.prototype.agregar = (req, res) => {
        const response = new HttpReponse(res);
        DataValidator.validate([
            {fieldName: "nombre", value: req.body.nombre, validator: "String", required: true},
            {fieldName: "apPaterno", value: req.body.apPaterno, validator: "String", required: true},
            {fieldName: "apMaterno", value: req.body.apMaterno, validator: "String", required: true},
            {fieldName: "telefono", value: req.body.telefono, validator: "Phone", required: true},
            {fieldName: "correo", value: req.body.correo, validator: "Email", required: true},
        ]).then((data1) => {
            DataValidator.validate([
                {fieldName: "estado", value: req.body.domicilio.estado, validator: "String", required: true},
                {fieldName: "municipio", value: req.body.domicilio.municipio, validator: "String", required: true},
                {fieldName: "cp", value: req.body.domicilio.cp, validator: "PostalCode", required: true},
                {fieldName: "colonia", value: req.body.domicilio.colonia, validator: "String", required: true},
                {fieldName: "calle", value: req.body.domicilio.calle, validator: "String", required: true},
                {fieldName: "noExterno", value: req.body.domicilio.noExterno, validator: "String", required: true},
                {fieldName: "noInterno", value: req.body.domicilio.noInterno, validator: "String", required: false},
                {fieldName: "referencia", value: req.body.domicilio.referencia, validator: "String", required: false},
            ]).then((data2) => {
                const data = data1;
                data.domicilio = data2;

                Cliente_Model.agregar(req.user._id, data)
                    .then((producto) => { response.success(producto); })
                    .catch((err) => { response.error(err); });
            }).catch((err) => {
                response.badRequest(err);
            });
        }).catch((err) => {
            response.badRequest(err);
        });
    };

    return Cliente_Controller;
})();

module.exports = Cliente_Controller;