const jwt = require('jsonwebtoken');

const accessTokenSecret = 'somerandomaccesstoken';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.cookies.Authorization;
    if (authHeader) {
        const token = authHeader; //.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                console.log('authenticateJWT: ' + err);
                return res.sendStatus(401);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(400);
    }
}

module.exports = {
    authenticateJWT
}