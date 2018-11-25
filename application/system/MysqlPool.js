const Mysql = require('promise-mysql');
const mysqlConfig = require('../../appConfig').database;
const Pool = Mysql.createPool(mysqlConfig);

module.exports = Pool;