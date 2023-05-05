const mongoose = require('mongoose');

require('dotenv').config();

const connectDb = async() => {
    const MONGODB_URL = process.env.MONGODB_URL;

    try {
        // connect to mongodb
        await mongoose.connect(MONGODB_URL);

        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDb;