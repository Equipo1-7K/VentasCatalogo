const config = require("../../appConfig").swagger;

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
        "./application/system/MetaFields.js",
        "./application/system/TokenHelper.js",
        "./application/routes/*.js",
        "./application/models/*.js"
    ]
};