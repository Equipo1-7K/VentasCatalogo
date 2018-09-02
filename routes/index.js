const router = require("express").Router();

const Usuarios_Router = require("./Usuarios_Router");
const Sesiones_Router = require("./Sesiones_Router");

router.use("/usuarios", Usuarios_Router);
router.use("/sesion", Sesiones_Router);
module.exports = router;