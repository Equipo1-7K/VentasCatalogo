const router = require("express").Router();
const middlewareSesion = (new (require("./sesion/Sesion_Controller"))()).verificarSesion;

const sesion = require("./sesion/Sesion_Router");
const usuario = require("./usuarios/Usuarios_Router");
const producto = require("./productos/Productos_Router");
const cliente = require("./clientes/Clientes_Router");

router.use("/sesion", sesion);
router.use("/usuarios", usuario);
router.use("/productos", middlewareSesion, producto);
router.use("/clientes", middlewareSesion, cliente);

module.exports = router;