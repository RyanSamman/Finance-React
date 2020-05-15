// Throws error if any uncaught exceptions occur
process.on('unhandledRejection', err => {
    throw err;
});

// Express
const express = require('express');
const app = express();

// Create OS independent path strings
const path = require('path');

// Access the file system for key.txt
const fs = require('fs');

// Give strings color, to hilight errors etc
// https://www.npmjs.com/package/chalk
const chalk = require('chalk');

// MongoDB Agent
const mongoose = require('mongoose');


console.time("Time taken to load the database:");
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to database");
    console.timeEnd("Time taken to load the database:");
});

// API Key
let AlphaVantageKey = process.env.API_KEY;

console.log(chalk.bgBlue.black(`Loaded key: "${AlphaVantageKey}"`));

// Loads API key
const alpha = require('alphavantage')({ key: AlphaVantageKey });

// Server will only handle backend, the Webpack Dev Server handles serving the html and scripts
/*
// serve static files (for CSS, pictures, etc)
app.use(express.static(path.join(__dirname, 'public')));
*/

// Test if API works
app.get('/helloworld', (req, res) => res.send('Hello World!'));

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

// Testing
app.get('/users', (req, res) => {
    return res.send('GET HTTP method on user resource');
});

app.post('/users', (req, res) => {
    return res.send('POST HTTP method on user resource');
});

app.put('/users/:userId', (req, res) => {
    return res.send(
        `PUT HTTP method on user/${req.params.userId} resource`,
    );
});

app.delete('/users/:userId', (req, res) => {
    return res.send(
        `DELETE HTTP method on user/${req.params.userId} resource`,
    );
});

// Use host's port, (if we decide to deploy on a service like Heroku) 
// or, if not found, use the port 5000
const PORT = process.env.PORT || 5000;

// Bind port 5000 to Express
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
