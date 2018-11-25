const Mysql = require('promise-mysql');
const mysqlConfig = require('../../appConfig').database;
const Pool = Mysql.createPool(mysqlConfig);
Pool.on('connection', () => console.log('lawea'))
console.log(Pool)

module.exports = Pool;