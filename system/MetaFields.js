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

const MetaFields = function(schema, options) {
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

    // Trigger al momento de crear el documento
    schema.pre("save", function(next) {
        console.log(this);
        this.meta.creado = Date.now();
        this.meta.modificado = Date.now();
        next();
    });


    // Trigger al momento de actualizar el documento
    schema.post("findOneAndUpdate", function(doc) {
        console.log("modificado");
        this.update({_id: doc.id}, {$set: {"meta.modificado": Date.now()}}, function(err, data) {
            return;
        });
    });
};

module.exports = MetaFields;