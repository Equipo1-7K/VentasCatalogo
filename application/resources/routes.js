const router = require("express").Router();
const middlewareSesion = (new (require("./sesion/Sesion_Controller"))()).verificarSesion;

const sesion = require("./sesion/Sesion_Router");
const usuario = require("./usuarios/Usuarios_Router");
const producto = require("./productos/Productos_Router");
const cliente = require("./clientes/Clientes_Router");
const venta = require("./ventas/Ventas_Router");
const reportes = require("./reportes/Reportes_Router");

router.use("/sesion", sesion);
router.use("/usuarios", usuario);
router.use("/productos", middlewareSesion, producto);
router.use("/clientes", middlewareSesion, cliente);
router.use("/ventas", middlewareSesion, venta);
router.use("/reportes", middlewareSesion, reportes);

module.exports = router;