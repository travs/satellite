const express = require('express')
const router = express.Router()
const ProofOfEmail = global.artifacts.require('ProofOfEmail');
const Sentencer = require('../node_modules/sentencer');
const sg = require('../node_modules/sendgrid')(process.env.SENDGRID_API_KEY);
const email = require('./email');
const moduleIndex = require('./module-index');

// ROUTING
router.get('/', function (req, res) {
  res.render('index', { title: 'Satellite', message: 'You can either verify or browse modules' })
})

router.get('/verification', function (req, res) {
  res.render('verification', { title: 'Verification', message: 'Verify' })
})

router.get('/shop', function (req, res) {
  res.render('shop',
    { title: 'Modules', message: 'Browse modules', modules: moduleIndex })
})

router.post('/verify', function (req, res) {
  // generate the code and token
  // send token to contract and send code to client
  var code = Sentencer.make('{{ adjective }} {{ adjective }} {{ nouns }}');
  ProofOfEmail.deployed()
  .then(instance => {
    var token = web3.sha3(code);
    return instance.puzzle(
      req.body.address, web3.sha3(token, {encoding: 'hex'}),
      web3.sha3(req.body.email)
    );
  })
  .then(() => {
    var request = email.sendCodeEmail(req.body.email, code);
    sg.API(request, (err, response) => {
      if(!err)
        res.status(200).send(`Verification email sent to ${req.body.email}`);
      else
        res.status(400).send('Failure sending mail');
    });
  })
})

module.exports = () => router
