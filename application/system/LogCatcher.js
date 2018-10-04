const config = require("../../appConfig").database;
const useragent = require("express-useragent");
const mysql = require("mysql");
const tokenHelper = require("./TokenHelper");

const mysqlPool = mysql.createPool(config);

module.exports = (req, res, next) => {
    if (req.headers["Authorization"])
        tokenHelper.verifyToken()
        mysqlPool.query("INSERT INTO bitacora VALUES (NULL, '0', ?, ?, ?, ?, DEFAULT)", [
            req.method,
            req.url,
            req.connection.remoteAddress,
            req.headers['user-agent']
        ]);
    next();
};