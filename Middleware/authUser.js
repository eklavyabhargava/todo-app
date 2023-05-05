require('dotenv').config();

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = ((req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({Error: "Not logged In. Please Login Again!"});
    }

    const token = authorization.replace('Bearer ', "");

    // verify token
    jwt.verify(token, JWT_SECRET, (error, payload) => {
        if (error) {
            return res.status(500).json({Error: "Internal Error Occurred!"});
        }

        User.findById(payload.id).then((user) => {
            if (!user) {
                return res.status(401).json({Error: "Invalid Credential(s)!"});
            }
            req.user = user;
            next();
        }).catch ((error) => {
            console.error(error.message);
            return res.status(500).json({Error: "Some Error Occurred!"});
        });
    });
});