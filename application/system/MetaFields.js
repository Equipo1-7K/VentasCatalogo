/**
 * @swagger
 * definitions:
 *   Meta:
 *     type: object
 *     properties:
 *       activo:
 *         type: boolean
 *       creado:
 *         type: string
 *       modificado:
 *         type: string
 *       eliminado:
 *         type: string
 *   Response:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *       responseCode:
 *         type: integer
 *       message:
 *         type: string
 */

const MetaFields = function(schema) {
    schema.add({
        meta: {
            activo: {
                type: Boolean,
                default: true
            },
            creado: {
                type: Date,
                default: null
            },
            modificado: {
                type: Date,
                default: null
            },
            eliminado: {
                type: Date,
                default: null
            }
        }
    });

    schema.set("versionKey", false);
    schema.set("timestamps", {
        createdAt: "meta.creado",
        updatedAt: "meta.modificado"
    });
};

module.exports = MetaFields;