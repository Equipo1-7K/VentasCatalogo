const host = "localhost:3000";

module.exports = {
    definition: {
        info: {
            title: "RestaurantNFC",
            version: "Dev 1.0.0",
        },
        host: host,
        basePath: "/api",
    },
    apis: [
        "./system/MetaFields.js",
        "./routes/*.js",
        "./models/*.js"
    ]
};