/**
 * @swagger
 * definitions:
 *   Usuario:
 *     type: object
 *     properties:
 *       meta:
 *         type: object
 *         $ref: '#/definitions/Meta'
 *       _id:
 *         type: string
 *       correo:
 *         type: string
 *       nombre:
 *         type: string
 *       apPaterno:
 *         type: string
 *       apMaterno:
 *         type: string
 *   UsuarioNuevo:
 *     type: object
 *     required:
 *      - correo
 *      - nombre
 *      - apPaterno
 *      - apMaterno
 *      - contrasena
 *     properties:
 *       correo:
 *         type: string
 *       nombre:
 *         type: string
 *       apPaterno:
 *         type: string
 *       apMaterno:
 *         type: string
 *       contrasena:
 *         type: string
 */
const mongoose = require("mongoose");
const saltGenerator = require("randomstring");
const sha256 = require("js-sha256");
const MetaFields = require("../system/MetaFields");

const Usuario = new mongoose.Schema({
    correo: {
        type: String,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
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
    contrasena: {
        type: String,
        required: true
    },
    sal: {
        type: String,
        required: true
    }
}, {versionKey: false});

Usuario.statics.obtenerPorId = function(id) {
    const db = this;
    
    return new Promise((resolve, reject) => {
        db.findOne({_id: id})
            .then((data) => { resolve(data); })
            .catch((err) => { reject(err); });
    });
};

Usuario.statics.registrar = function(usuarioNuevo) {
    usuarioNuevo.sal = saltGenerator.generate(32);
    usuarioNuevo.contrasena = sha256(usuarioNuevo.sal + usuarioNuevo.contrasena);

    const db = this;

    return new Promise((resolve, reject) => {
        db.create(usuarioNuevo)
            .then((data) => { resolve(data); })
            .catch((err) => { reject(err); });
    });
};

Usuario.plugin(MetaFields);

module.exports = mongoose.model("Usuarios", Usuario);