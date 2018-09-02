const jwt = require("jsonwebtoken");

const secretKey = "A8vrbPDccsVuSaApnP5x5h83Ld9nU6XKjZ9ChTDaDFejEGCvfnc5LhFxd8HFtxWrcb3KaXWWSd6zhwmWtfcEHbKYkkaNbL6BRnq6253KBHmQzEwm8HxkhjBg9L8WK3Ah";

const TokenHelper = { };

TokenHelper.createToken = function(user) {
    return jwt.sign({payload: user}, secretKey, {
        expiresIn: "1h"
    });
};

TokenHelper.verifyToken = function(sesion) {
    return new Promise((resolve, reject) => {
        try {
            resolve(jwt.verify(sesion.token, secretKey));
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = TokenHelper;