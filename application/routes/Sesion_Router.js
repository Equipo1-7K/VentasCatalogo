const router = require("express").Router();
const Sesion = new (require("../controllers/Sesion_Controller"))();
const HttpResponse = require("../system/HttpResponse");

router.get("/", Sesion.iniciarSesion);

// Método no admitido
router.use((req, res) => {
    const response = new HttpResponse(res);
    response.methodNotAllowed({
        message: `El método ${req.method} no está disponible para esta ruta`
    });
});

module.exports = router;