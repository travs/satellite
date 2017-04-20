const contract = require('truffle-contract');
const path = require('path');
const express = require('../node_modules/express');
const bodyParser = require('../node_modules/body-parser');
const routes = require('./routes');
const ProofOfEmail = artifacts.require('ProofOfEmail');

const port = 1776;
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes());

// VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var server = app.listen(port, function () {
  console.log(`Server started on port http://localhost:${port}`);
});

module.exports = server;
