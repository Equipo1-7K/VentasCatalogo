/**
 * @swagger
 * definitions:
 *   InicioSesion:
 *     type: object
 *     required:
 *      - correo
 *      - contrasena
 *     properties:
 *       correo:
 *         type: string
 *       contrasena:
 *         type: string
 */
const mongoose = require("mongoose");
const TokenHelper = require("../system/TokenHelper");

const Sesion = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios",
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, {versionKey: false});

Sesion.statics.iniciarSesion = function(usuario) {
    const db = this;

    return new Promise((resolve, reject) => {
        const token = TokenHelper.createToken(usuario);
        db.create({
            usuario: usuario._id,
            token: token
        }).then(() => {
            resolve({
                usuario: usuario,
                token: token
            });
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = mongoose.model("Sesiones", Sesion);