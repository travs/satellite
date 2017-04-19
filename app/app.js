const Web3 = require('web3');
const contract = require('truffle-contract');
const satellite_artifacts = require('../build/contracts/Satellite.json');
const email_artifacts = require('../build/contracts/ProofOfEmail.json');
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var helper = require('sendgrid').mail;
var express = require('express');
const Sentencer = require('sentencer');

let provider = new Web3.providers.HttpProvider('http://localhost:8545');
let web3 = new Web3(provider);

// ROUTING
let server = express();
server.post('/address/:address/email/:email', function (req, res) {
  // generate the code and token
  // send token to contract and send code to client
  var code = Sentencer.make('{{ adjective }} {{ adjective }} {{ nouns }}');
  var token = web3.sha3(code);
  emailVerifyInstance.puzzle(
    req.params.address, web3.sha3(token, {encoding: 'hex'}),
    web3.sha3(req.params.email), {from: web3.eth.accounts[0]}
  )
  .then(() => {
    sendCodeEmail(req.params.email, code);
    res.send(`Verification email sent to ${req.params.email}`);
  })
})

// RUN SERVER
let emailVerifyInstance;
let ProofOfEmail = contract(email_artifacts);
ProofOfEmail.setProvider(provider);
ProofOfEmail.deployed()
.then(instance => emailVerifyInstance = instance)
.then(() => requestedEvent = emailVerifyInstance.Requested())
.then(() => {
  server.listen(3002, function () {
    console.log('Server started')
  })
})
