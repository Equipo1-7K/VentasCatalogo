const HttpReponse = require("../system/HttpResponse");
const DataValidator = require("../system/Validator");
const Producto_Model = require("../models/Producto_Model");

const Producto_Controller = (function() {
    function Producto_Controller() {}

    Producto_Controller.prototype.obtenerPorId = (req, res) => {
        const response = new HttpReponse(res);
        DataValidator.validate([
            {fieldName: "id", value: req.params.id, validator: "MongoID", required: true},
        ]).then((data) => {
            Producto_Model.obtenerPorId(data.id)
                .then((producto) => { response.success(producto); })
                .catch((err) => { response.error(err); });
        }).catch((err) => {
            response.badRequest(err);
        });
    };

    Producto_Controller.prototype.obtenerPorUsuario = (req, res) => {
        const response = new HttpReponse(res);

        Producto_Model.obtenerPorUsuario(req.user._id)
            .then((productos) => {
                response.success(productos); 
            })
            .catch((err) => {
                response.error(err);
            });
    };

    Producto_Controller.prototype.agregar = (req, res) => {
        const response = new HttpReponse(res);
        DataValidator.validate([
            {fieldName: "nombre", value: req.body.nombre, validator: "String", required: true},
            {fieldName: "descripcion", value: req.body.descripcion, validator: "String", required: true},
            {fieldName: "precio", value: req.body.precio, validator: "Double", required: true},
            {fieldName: "imagen", value: req.body.imagen, validator: "String", required: true}
        ]).then((data) => {
            console.log(data);
            console.log(req.user);
            Producto_Model.agregar(req.user._id, data)
                .then((producto) => { response.success(producto); })
                .catch((err) => { response.error(err); });
        }).catch((err) => {
            response.badRequest(err);
        });
    };

    return Producto_Controller;
})();

module.exports = Producto_Controller;