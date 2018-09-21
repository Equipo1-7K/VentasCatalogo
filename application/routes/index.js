const router = require("express").Router();

const Usuarios_Router = require("./Usuarios_Router");
const Sesiones_Router = require("./Sesiones_Router");
const Producto_Router = require("./Producto_Router");
const Cliente_Router = require("./Cliente_Router");

router.use("/usuarios", Usuarios_Router);
router.use("/sesion", Sesiones_Router);
router.use("/productos", Producto_Router);
router.use("/clientes", Cliente_Router);
module.exports = router;