const path = require('path');
const express = require('../node_modules/express');
const bodyParser = require('../node_modules/body-parser');
const routes = require('./routes');

// APP CONFIG
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

module.exports = app;
