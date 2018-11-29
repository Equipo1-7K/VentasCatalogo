const Pool = require('../../system/MysqlPool');
const Ventas = require('../ventas/Ventas_Model');

// Declaración de la clase
module.exports = (function() {
    
    function Reportes_Model() { }

    Reportes_Model.prototype.obtenerCobrosDia = (idUsuario, page, perPage) => {
        const offset = (page - 1) * perPage;
        const limit = perPage;
        let cobros;
        return new Promise((resolve, reject) => {
            const queryString = `
            SELECT
                vag.idVenta,
                vag.consecutivo,
                ta.totalAbonos,
                vag.fechaAPagar,
                (vag.cantidadAPagar - vag.pagado) as deuda
            FROM
                venta_abonosGenerados vag
                INNER JOIN ventas v on vag.idVenta = v.id
                INNER JOIN clientes c on v.idCliente = c.id
                INNER JOIN ( select idVenta,  COUNT(*) as totalAbonos FROM venta_abonosGenerados group by idVenta) as ta On vag.idVenta = ta.idVenta
            WHERE v.idUsuario = ? AND fechaAPagar <= CURRENT_DATE AND (vag.cantidadAPagar - vag.pagado) > 0
            LIMIT ? OFFSET ?`
            const p1 = Pool.query(queryString, [
                idUsuario,
                limit,
                offset
            ]).then(results => {
                cobros = results;
                const promisesArray = [];
                const ventas = new Ventas();
                cobros.forEach((cobro, index, array) => {
                    const promise = new Promise((resolve, reject) => {
                        ventas.obtenerClientePorIdVenta(idUsuario, cobro.idVenta).then(cliente => {
                            array[index].cliente = cliente;
                            resolve();
                        }).catch(err => reject(err))
                    })
                    
                    promisesArray.push(promise);
                });

                return Promise.all(promisesArray);
            }).then(() => {
                return Pool.query(`
                SELECT
                    count(*) as total
                FROM
                    venta_abonosGenerados vag
                    INNER JOIN ventas v on vag.idVenta = v.id
                    INNER JOIN clientes c on v.idCliente = c.id
                    INNER JOIN ( select idVenta,  COUNT(*) as totalAbonos FROM venta_abonosGenerados group by idVenta) as ta On vag.idVenta = ta.idVenta
                WHERE v.idUsuario = ? AND fechaAPagar <= CURRENT_DATE AND (vag.cantidadAPagar - vag.pagado) > 0`, [
                    idUsuario
                ])
            }).then(result => {
                resolve({
                    items: cobros,
                    total: result[0].total
                });
            }).catch(err => {
                reject(err);
            });
        })
    }

    return Reportes_Model;
})();