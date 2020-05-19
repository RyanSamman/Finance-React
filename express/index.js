// Throws error if any uncaught exceptions occur
process.on('unhandledRejection', err => {
    throw err;
});

const config = require("./config/config");
console.log(config);

// Create OS independent path strings
// const path = require('path');
// Access the file system
// const fs = require('fs');
// Give strings color, to highlight errors etc https://www.npmjs.com/package/chalk
const chalk = require('chalk');

// Express
const express = require('express');
const app = express();
require("./loaders/express");

// MongoDB Agent
const mongoose = require('mongoose');
// const models = require("./models/Models");

// User Model: models.User();
// Stock Model: models.Stock();

// Loading Database & Recording time taken to load
console.time("Time taken to load the database:");
mongoose.connect(config.MONGOURI,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to database");
    console.timeEnd("Time taken to load the database:");
});

// Initialize AlphaVantage API 
const alpha = require('alphavantage')({ key: config.API_KEY });

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
// It's better to set a field "deleted:" instead of actually deleting the record,
// This way you can trace errors etc.
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
