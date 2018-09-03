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
 *         properties:
 *           estado:
 *             type: string
 *           municipio:
 *             type: string
 *           cp:
 *             type: string
 *             pattern: '^\d{5}$'
 *           colonia:
 *             type: string
 *           calle:
 *             type: string
 *           noExterno:
 *             type: string
 *           noInterno:
 *             type: string
 *           referencia:
 *             type: string
 *       telefono:
 *         type: string
 *         pattern: '^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$'
 *       correo:
 *         type: string
 *         pattern: '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
 */
const mongoose = require("mongoose");
const MetaFields = require("../system/MetaFields");

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

// Terminan funciones

// Campos meta y triggers
Cliente.plugin(MetaFields);

module.exports = mongoose.model("Clientes", Cliente);