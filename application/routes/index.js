const router = require("express").Router();
const HttpResponse = require("../system/HttpResponse");

const Sesion = require("./Sesion_Router");

// Validamos content-type
router.use((req, res, next) => {
    console.log(req.headers["content-type"] !== "application/json");
    if (req.method !== "GET" && 
        req.headers["content-type"] !== "application/json" && 
        req.headers["content-type"] !== "application/x-www-form-urlencoded"
    ) {
        const response = new HttpResponse(res);
        response.unsupportedMediaType({
            message: "Sólo se aceptan formatos 'application/json' ó 'x-www-form-urlencoded'"
        });
    } else {
        next();
    }
})

// Montamos los controladores
router.use("/sesion", Sesion);

module.exports = router;