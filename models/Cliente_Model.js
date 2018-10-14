/**
 * @swagger
 * definitions:
 *   Cliente:
 *     type: object
 *     properties:
 *       meta:
 *         type: object
 *         $ref: '#/definitions/Meta'
 *       _id:
 *         type: string
 *       nombre:
 *         type: string
 *       apPaterno:
 *         type: string
 *       apMaterno:
 *         type: string
 *       domicilio:
 *         type: object
 *         $ref: '#/definitions/Domicilio'
 *       telefono:
 *         type: string
 *         pattern: '^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$'
 *       correo:
 *         type: string
 *         pattern: '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
 *   Domicilio:
 *     type: object
 *     properties:
 *       estado:
 *         type: string
 *       municipio:
 *         type: string
 *       cp:
 *         type: string
 *         pattern: '^\d{5}$'
 *       colonia:
 *         type: string
 *       calle:
 *        type: string
 *       noExterno:
 *         type: string
 *       noInterno:
 *         type: string
 *       referencia:
 *         type: string
 *   ClienteNuevo:
 *     type: object
 *     required:
 *      - nombre
 *      - apPaterno
 *      - apMaterno
 *      - domicilio
 *      - telefono
 *      - correo
 *     properties:
 *       nombre:
 *         type: string
 *       apPaterno:
 *         type: string
 *       apMaterno:
 *         type: string
 *       domicilio:
 *         type: object
 *         $ref: '#/definitions/DomicilioNuevo'
 *       telefono:
 *         type: string
 *         pattern: '^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$'
 *       correo:
 *         type: string
 *         pattern: '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
 *   DomicilioNuevo:
 *     type: object
 *     required:
 *      - estado
 *      - municipio
 *      - cp
 *      - colonia
 *      - calle
 *      - noExterno
 *      - referencia
 *     properties:
 *       estado:
 *         type: string
 *       municipio:
 *         type: string
 *       cp:
 *         type: string
 *         pattern: '^\d{5}$'
 *       colonia:
 *         type: string
 *       calle:
 *        type: string
 *       noExterno:
 *         type: string
 *       noInterno:
 *         type: string
 *       referencia:
 *         type: string
 */
const mongoose = require("mongoose");
const MetaFields = require("../system/MetaFields");
const Usuario_Model = require("./Usuario_Model");

// Esquema Domicilio, utilizado en el cliente
const Domicilio = new mongoose.Schema({
    estado: {
        type: String,
        required: true
    },
    municipio: {
        type: String,
        required: true
    },
    cp: {
        type: String,
        match: /^\d{5}$/,
        required: true
    },
    colonia: {
        type: String,
        required: true
    },
    calle: {
        type: String,
        required: true
    },
    noExterno: {
        type: String,
        required: true
    },
    noInterno: {
        type: String
    },
    referencia: {
        type: String,
        required: true
    },
});
Domicilio.plugin(MetaFields);

// Esquema de cliente
const Cliente = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apPaterno: {
        type: String,
        required: true
    },
    apMaterno: {
        type: String,
        required: true
    },
    domicilio: {
        type: Domicilio,
        required: true
    },
    telefono: {
        type: String,
        required: false,
        match: /^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$/
    },
    correo: {
        type: String,
        required: false,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
});

// Inician functiones
Cliente.statics.obtenerPorId = function(id) {
    const db = this;

    return new Promise((resolve, reject) => {
        db.findOne({_id: id})
            .this((cliente) => { resolve(cliente); })
            .catch((err) => { reject(err); });
    });
};

Cliente.statics.obtenerPorUsuario = function(id) {
    return new Promise((resolve, reject) => {
        Usuario_Model.findOne({ _id: id })
            .select({ _id: false, clientes: true })
            .populate("clientes")
            .then((usuario) => { console.log(usuario); resolve(usuario.clientes); })
            .catch((err) => { reject(err); });
    });
};

Cliente.statics.agregar = function(idUsuario, cliente) {
    const db = this;

    return new Promise((resolve, reject) => {
        db.create(cliente)
            .then((cliente) => {
                Usuario_Model.asociarCliente(idUsuario, cliente._id)
                    .then(() => { resolve(cliente); })
                    .catch((err) => { reject(err); });
            })
            .catch((err) => { reject(err); });
    });
};
// Terminan funciones

// Campos meta y triggers
Cliente.plugin(MetaFields);

module.exports = mongoose.model("Clientes", Cliente);