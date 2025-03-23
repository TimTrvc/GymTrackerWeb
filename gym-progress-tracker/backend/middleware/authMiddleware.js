const jwt = require('jsonwebtoken')
const res = require("express/lib/response");
const res = require("express/lib/response");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Keine Zugangsberechtigung. Token fehlt.'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.users = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Ungültiger oder abgelaufener Token.' });
    }
};

module.exports = authMiddleware;