/**
 * @swagger
 * definitions:
 *   Meta_ok:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: true
 *       responseCode:
 *         type: integer
 *         default: 200
 *       message:
 *         type: string
 *         default: OK
 *   Meta_created:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: true
 *       responseCode:
 *         type: integer
 *         default: 201
 *       message:
 *         type: string
 *         default: Created
 *   Meta_noContent:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: true
 *       responseCode:
 *         type: integer
 *         default: 204
 *       message:
 *         type: string
 *         default: No Content
 *   Meta_notModified:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 304
 *       message:
 *         type: string
 *         default: Not Modified
 *   Meta_badRequest:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 400
 *       message:
 *         type: string
 *         default: Bad Request
 *   Meta_unauthorized:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 401
 *       message:
 *         type: string
 *         default: Unauthorized
 *   Meta_forbidden:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 403
 *       message:
 *         type: string
 *         default: Forbidden
 *   Meta_notFound:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 404
 *       message:
 *         type: string
 *         default: Not Found
 *   Meta_methodNotAllowed:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 405
 *       message:
 *         type: string
 *         default: OK
 *   Meta_gone:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 410
 *       message:
 *         type: string
 *         default: Gone
 *   Meta_unsupportedMediaType:
 *     type: false
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 415
 *       message:
 *         type: string
 *         default: Unsupported Media Type
 *   Meta_tooManyRequests:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 429
 *       message:
 *         type: string
 *         default: Too Many Requests
 *   Meta_internalServerError:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       responseCode:
 *         type: integer
 *         default: 500
 *       message:
 *         type: string
 *         default: Internal Server Error
 */

// Declaración de la clase
module.exports = (function() {
    const responses = {
        200: "OK",
        201: "Created",
        204: "No Content",
        304: "Not Modified",
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        410: "Gone",
        415: "Unsupported Media Type",
        429: "Too Many Requests",
        500: "Internal Server Error"
    }

    function HttpResponse(res) {
        for (code in responses) {

            // Para que no se sustituya el código alv
            const staticCode = code;

            // Hacemos que el nombre del método a invocar sea camelCase 
            let methodName = "";
            const methodWords = responses[staticCode].split(" ");
            for (index in methodWords) {
                // Hacemos toda la palabra minúscula
                methodWords[index] = methodWords[index].toLowerCase();

                // Si no es la primera palabra, hacemos la primera letra mayúscula
                if (index > 0) {
                    methodWords[index] = methodWords[index][0].toUpperCase() + methodWords[index].substr(1);
                }
                methodName += methodWords[index];
            }

            // Creamos el método de respuesta con el nombre generado en camelCase
            HttpResponse.prototype[methodName] = (data) => {
                res.status(staticCode).json({
                    status: staticCode.toString()[0] == "2",
                    responseCode: staticCode,
                    message: responses[staticCode],
                    data: data
                })
            }
        }
    }

    return HttpResponse;
})();