const config = __appconfig.swagger;

module.exports = {
    definition: {
        info: {
            title: "Ventas Por Catálogo",
            version: "Dev 1.0.0",
        },
        host: config.host + ":" + config.port,
        basePath: config.basePath,
    },
    apis: [
        "./application/system/HttpResponse.js",
        "./application/system/TokenHelper.js",
        "./application/resources/**/*.js"
    ]
};