const host = "localhost:3000";

module.exports = {
    definition: {
        info: {
            title: "Ventas Por Catálogo",
            version: "Dev 1.0.0",
        },
        host: host,
        basePath: "/api",
    },
    apis: [
        "./system/MetaFields.js",
        "./system/TokenHelper.js",
        "./routes/*.js",
        "./schemas/*.js",
        "./models/*.js"
    ]
};