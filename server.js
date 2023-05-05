require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDb = require('./db');
const app = express();
const port = process.env.PORT;

// get logs
const logger = morgan(':remote-addr :user-agent :referrer :method :url :status :res[content-length] - :response-time ms');

// connect to db
connectDb();

// import models
require('./Models/userModel');
require('./Models/taskModel');

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(require('./Routes/authenticate'));
app.use(require('./Routes/handleTasks'));

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Server listening on port ${port}!`))