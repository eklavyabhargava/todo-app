require('dotenv').config();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const User = mongoose.model('User');

// API: User Registration
router.post('/auth/register', async(req, res) => {
    const { email, username, password } = req.body;

    // validate input
    if (!email || !username || !password) {
        return res.status(400).json({Error: "All fields are mandaotry!"});
    }

    // create new user
    try {
        // check for uniqueness of email and username
        const emailFound = await User.findOne({ email });
        if (emailFound) {
            return res.status(400).json({ Error: "User with given email already exists!" });
        }
        
        // find user with same username in database
        const userFound = await User.findOne({ username });
        if (userFound) {
            return res.status(400).json({ Error: "Username already exists!" });
        }

        // hash password and create new user
        const hashedPassword = await bcryptjs.hash(password, 16);
        const newUser = new User({ email, username, password: hashedPassword });
        const userInfo = await newUser.save();

        res.status(201).json({ Success: "Account created successfully!", username: userInfo.username });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ Error: "Internal error occurred!" });
    }
});

// API: User Login
router.post('/auth/login', async(req, res) => {
    const { username, password } = req.body;

    // validate inputs
    if (!username || !password) {
        return res.status(400).json({Error: "Mandatory fields are missing!"});
    }

    try {
        // check username in db
        const user = await User.findOne({ username });
        if (user) {
            // compare password with saved password
            const didMatch = await bcryptjs.compare(password, user.password);

            // if match, login user
            if (didMatch) {
                const jwtToken = jwt.sign({ id: user._id}, JWT_SECRET);
                return res.status(200).json({Token: jwtToken, userId: user._id});
            } else {
                return res.status(401).json({Error: "Invalid Credentials!"});
            }
        } else {
            return res.status(401).json({Error: "Invalid Credentials!"});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({Error: "Internal Error Occurred!"});
    }
});

module.exports = router;