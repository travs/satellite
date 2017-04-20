const contract = require('truffle-contract');
const sg = require('../node_modules/sendgrid')(process.env.SENDGRID_API_KEY);
var helper = require('../node_modules/sendgrid').mail;
var express = require('../node_modules/express');
const Sentencer = require('../node_modules/sentencer');
const ProofOfEmail = artifacts.require('./ProofOfEmail.sol');
var helper = require('sendgrid').mail;

// EMAIL API
function sendCodeEmail (email, code) {
  var from_email = new helper.Email('verify@melonport.com');
  var to_email = new helper.Email(email);
  var subject = 'Melonport Verification Request';
  var content = new helper.Content('text/plain',
    `Please enter this code at the contract:  ${code}`
  );
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  return sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
}

// ROUTING
let app = express();
app.post('/address/:address/email/:email', function (req, res) {
  // generate the code and token
  // send token to contract and send code to client
  var code = Sentencer.make('{{ adjective }} {{ adjective }} {{ nouns }}');
  ProofOfEmail.deployed()
  .then(instance => {
    var token = web3.sha3(code);
    return instance.puzzle(
      req.params.address, web3.sha3(token, {encoding: 'hex'}),
      web3.sha3(req.params.email)
    );
  })
  .then(() => {
    var request = sendCodeEmail(req.params.email, code);
    sg.API(request, (err, response) => {
      if(!err)
        res.status(200).send(`Verification email sent to ${req.params.email}`);
      else
        res.status(400).send('Failure sending mail');
    });
  })
})

var server = app.listen(3002, function () {
  // console.log('Server started');
});

module.exports = server;
