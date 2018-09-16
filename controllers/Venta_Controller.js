const HttpReponse = require("../system/HttpResponse");
const DataValidator = require("../system/Validator");
const Venta_Model = require("../models/Venta_Model");
const Abono_Schema = require("../schemas/Abono_Schema")

const Venta_Controller = (function() {
    function Venta_Controller() {}

    Venta_Controller.prototype.obtenerPorId = (req, res) => {
        const response = new HttpReponse(res);
        DataValidator.validate([
            {fieldName: "id", value: req.params.id, validator: "MongoID", required: true},
        ]).then((data) => {
            Venta_Model.obtenerPorId(data.id)
                .then((cliente) => { response.success(cliente); })
                .catch((err) => { response.error(err); });
        }).catch((err) => {
            response.badRequest(err);
        });
    };

    Venta_Controller.prototype.obtenerPorUsuario = (req, res) => {
        const response = new HttpReponse(res);

        Venta_Model.obtenerPorUsuario(req.user._id)
            .then((clientes) => {
                response.success(clientes);
            })
            .catch((err) => {
                response.error(err);
            });
    };

    Venta_Controller.prototype.agregar = (req, res) => {
        const response = new HttpReponse(res);
        ValidarVenta(req.body)
            .then((venta) => {
                Venta_Model.agregar(req.user._id, venta)
                    .then((venta) => {
                        response.success(venta);
                    })
                    .catch((err) => {
                        response.error(err);
                    });
            })
            .catch((err) => {
                response.badRequest(err);
            });
    };
    
    // Validación manual de la venta
    const ValidarVenta = (venta) => {
        return new Promise((resolve, reject) => {
            const invalidData = { };
            const validatedData = { };
    
            // Validamos el cliente
            if (!(new String(venta.cliente)).match(DataValidator.Regex.MongoID)) {
                invalidData.cliente = venta.cliente;
            } else {
                validatedData.cliente = venta.cliente;
            }
    
            // Validamos los productos
            if (!Array.isArray(venta.productos)) {
                invalidData.productos = venta.productos;
            } else {
                // Validamos cada producto en productos
                validatedData.productos = [];
                venta.productos.forEach(producto => {
                    if (
                        !(new String(producto.producto)).match(DataValidator.Regex.MongoID) ||
                        !(new String(producto.cantidad)).match(DataValidator.Regex.Double)
                    ) {
                        if (!Array.isArray(invalidData.productos))
                            invalidData.productos = [];
                        invalidData.productos.push(producto);
                    } else {
                        validatedData.productos.push(producto);
                    }
                });
            }
    
            // Validamos el pago
            if ((typeof venta.pago !== "object") || (venta.pago === null)) {
                invalidData.pago = venta.pago;
            } else {
                if (
                    ((new String(venta.pago.tipo)) == "Credito") &&
                    (new String(venta.pago.abonoAcordado)).match(DataValidator.Regex.Double) &&
                    (new String(venta.pago.plazo)).match(DataValidator.Regex.Integer)
                ) {
                    validatedData.pago = venta.pago;
                    validatedData.pago.fechaInicio = new Date();
                    validatedData.pago.abonosRealizados = [];
                } else if (
                    (new String(venta.pago.tipo)) == "Contado"
                ) {
                    validatedData.pago = {
                        tipo: venta.pago.tipo
                    };
                } else {
                    invalidData.pago = venta.pago;
                }
            }
    
            // Revisamos si hay datos inválidos
            if (Object.keys(invalidData).length === 0) {
                resolve(validatedData);
            } else {
                reject(invalidData);
            }
        });
    };

    return Venta_Controller;
})();

module.exports = Venta_Controller;