const Web3 = require('web3');
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const contract = require('truffle-contract');
const email_artifacts = require('../build/contracts/ProofOfEmail.json');
const Sentencer = require('sentencer');
var helper = require('sendgrid').mail;
var express = require('express')

function sendCodeEmail (receiverEmail, code) {
  // construct email
  var from_email = new helper.Email('verify@melonport.com');
  var to_email = new helper.Email(receiverEmail);
  var subject = 'Melonport Email Verification';
  var content = new helper.Content('text/plain',
    `In order to verify your address with Melonport, we need you to hit our
    contract with this code: \n\n ${code}`
  );
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
}

let emailVerifyInstance;
let provider = new Web3.providers.HttpProvider('http://localhost:8545');
let web3 = new Web3(provider);
let ProofOfEmail = contract(email_artifacts);
ProofOfEmail.setProvider(provider);

ProofOfEmail.deployed()
.then(res => emailVerifyInstance = res)
.then(() => requestedEvent = emailVerifyInstance.Requested())
.then(() => {
  var server = express();

  server.post('/address/:address/email/:email', function (req, res) {
    // generate the code and token
    // send token to contract and send code to client
    var code = Sentencer.make('{{ adjective }} {{ adjective }} {{ nouns }}');
    var token = web3.sha3(code);
    emailVerifyInstance.puzzle(
      req.params.address, web3.sha3(token, {encoding: 'hex'}), web3.sha3(req.params.email),
      {from: web3.eth.accounts[0]}
    )
    .then(() => {
      sendCodeEmail(req.params.email, code);
      console.log(`Email sent to ${req.params.email}`);
      res.send('Success');
    })
  })

  server.listen(3002, function () {
    console.log('Server started')
  })
})
