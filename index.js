// Throws error if any uncaught exceptions occur
process.on('unhandledRejection', err => {
    throw err;
});

// Load correct .env
require("dotenv").config({ path: '.env' });

// Create OS independent path strings
const path = require('path');
// Access the file system for key.txt
const fs = require('fs');
// Give strings color, to highlight errors etc https://www.npmjs.com/package/chalk
const chalk = require('chalk');

// Express
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

// MongoDB Agent
const mongoose = require('mongoose');
const models = require("./Models");

// User Model: models.User();
// Stock Model: models.Stock();

// Loading Database & Recording time taken to load
console.time("Time taken to load the database:");
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to database");
    console.timeEnd("Time taken to load the database:");
});

// API Key
let AlphaVantageKey;

if (process.env.API_KEY) {
    AlphaVantageKey = process.env.API_KEY;
    console.log(chalk.bgBlue.black(`Loaded key: "${AlphaVantageKey}"`));
} else {
    throw Error(chalk.bgRed.black("NO API KEY FOUND! - Go over README.md")); // !! add your key to .env !!
}

// Initialize AlphaVantage API 
const alpha = require('alphavantage')({ key: AlphaVantageKey });

// Server will only handle backend, the Webpack Dev Server Handles Frontend
/*
// serve static files (for CSS, pictures, etc)
app.use(express.static(path.join(__dirname, 'public')));
*/


/* ~~~~~~~~~~~ Express MiddleWare ~~~~~~~~~~~~~~~~~~~~~~~~~ */
// Prints to console the requests given to the server
// TODO
app.use((req, res, next) => {
    console.log(chalk.bgBlue.black(`Method: ${req.method}; Path: ${req.path} - ${req.ip}`));
    next();
})

// Middleware processing form data - https://github.com/expressjs/body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware processing cookies - https://github.com/expressjs/cookie-parser
app.use(cookieParser());

// Test if API works / server is open
app.get('/helloworld', (req, res) => res.send('Hello World!'));

/* ~~~~~~~~~~~~ Stock Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// Display demo API data
app.get('/api/stocks/:symbol', (req, res) => {
    alpha.data.daily(req.params.symbol)
        .then((data) => alpha.util.polish(data),
            err => {
                console.log(toString(err));
                res.status(404).send(err)
            })
        .then((data) => res.status(200).send(data));
});

app.get('/api/crypto/:symbol', (req, res) => {
    alpha.data.daily(req.params.symbol)
        .then((data) => alpha.util.polish(data),
            err => {
                console.log(toString(err));
                res.status(404).send(err)
            })
        .then((data) => res.status(200).send(data));
});

/* ~~~~~~~~~~~~ User Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Compare 
app.get('/users', (req, res) => {
    // req.params is for imbedded in URL, ex /users/:userId
    // req.query is for after path; /users?name1=value1&name2=value2...
    if (req.query) {
        console.log(req.query);
        return res.status(200).json(req.query);
    }
    console.log(req.cookies);
    res.status(400).json({ "error": "Invalid query" });
});

// Creates new User
app.post('/users', (req, res) => {
    // Checks if body is present, if not, send error
    if (req.body) {
        // re-sends processed form data as a json
        console.log(req.body)
        return res.status(202).json(req.body)
    }
    res.status(400).json({ "error": "Invalid query" });
});

// Updates User information
app.put('/users/:userId', (req, res) => {
    res.send(
        `PUT HTTP method on user/${req.params.userId} resource`,
    );
});

// Deletes user information
app.delete('/users/:userId', (req, res) => {
    res.send(
        `DELETE HTTP method on user/${req.params.userId} resource`,
    );
});

// Use host's port, (if we decide to deploy on a service like Heroku) 
// or, if not found, use the port 5000
const PORT = process.env.PORT || 5000;

// Bind port 5000 to Express
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
