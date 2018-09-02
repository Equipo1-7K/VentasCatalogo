const jwt = require("jsonwebtoken");

const secretKey = "A8vrbPDccsVuSaApnP5x5h83Ld9nU6XKjZ9ChTDaDFejEGCvfnc5LhFxd8HFtxWrcb3KaXWWSd6zhwmWtfcEHbKYkkaNbL6BRnq6253KBHmQzEwm8HxkhjBg9L8WK3Ah";

const TokenHelper = { };

TokenHelper.createToken = function(user) {
    console.log(user);
    return jwt.sign({payload: user, expiresIn: "1d"}, secretKey, {
        expiresIn: 86400 // expires in 24 hours
    });
};

TokenHelper.verifyToken = function(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject("Sin token");
        } else {
            try {
                resolve(jwt.verify(token, secretKey));
            } catch (err) {
                reject(err);
            }
        }
    });
};

module.exports = TokenHelper;