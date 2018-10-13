module.exports.ValidationException = (function() {
    function ValidationException(errores) {
        this.errores = errores
    }

    ValidationException.prototype = Object.create(Error.prototype);

    ValidationException.prototype.response = function(response) {
        response.badRequest(this.errores);
    }

    return ValidationException;
})();

module.exports.ControllerException = (function() {
    function ControllerException(responseMessage, data) {
        this.responseMessage = responseMessage;
        this.data = data;
    }

    ControllerException.prototype = Object.create(Error.prototype);

    ControllerException.prototype.response = function(response) {
        response[this.responseMessage](this.data);
    }

    return ControllerException;
})();