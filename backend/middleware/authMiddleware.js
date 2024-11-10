// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send({ message: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send({ message: "Invalid token" });
    }
};

const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).send({ message: "Forbidden" });
        next();
    };
};

module.exports = { authenticate, authorize };
