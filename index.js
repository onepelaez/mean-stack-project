const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Error Database Connection: ', err);
    } else {
        console.log('Connected to Database: ' + config.db);
    }
});

app.get('*', (req, res) => {
    res.send('<h1>OnePelaez</h1>');
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});
