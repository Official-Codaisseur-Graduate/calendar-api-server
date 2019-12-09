const jwt = require('jsonwebtoken');

const secret =
    process.env.JWT_SECRET ||
    '$=zY$T+qPxiC#wXB7!Jq3UUX!mO&MVY*m8kyxRgUtpR@dPniVJzNof!!&iDld=np';

const toJWT = data => {
    if (process.env.PORT) {
        return jwt.sign(data, secret, {
            expiresIn: '15m',
        });
    }

    // Development - testing
    return jwt.sign(data, secret, {
        expiresIn: '24h',
    });
};

const toData = token => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

module.exports = {
    toJWT,
    toData,
};
