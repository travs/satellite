const contract = require('truffle-contract');
const path = require('path');
const express = require('../node_modules/express');
const bodyParser = require('../node_modules/body-parser');
const Sentencer = require('../node_modules/sentencer');
const sg = require('../node_modules/sendgrid')(process.env.SENDGRID_API_KEY);
const helper = require('../node_modules/sendgrid').mail;
var ProofOfEmail = artifacts.require('ProofOfEmail');

// EMAIL API
function sendCodeEmail (email, code) {
  var from_email = new helper.Email('verify@melonport.com');
  var to_email = new helper.Email(email);
  var subject = 'Melonport Verification Request';
  var content = new helper.Content('text/plain',
    `Please enter this code at the contract:  ${code}`
  );
  var mail = new helper.Mail(from_email, subject, to_email, content);

  return sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
}

// BEGIN APP //
const port = 1776;
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// ROUTING
app.get('/', function (req, res) {
  res.render('index', { title: 'Satellite', message: 'You can either verify or browse modules' })
})

app.get('/verification', function (req, res) {
  res.render('verification', { title: 'Verification', message: 'Verify' })
})

app.get('/shop', function (req, res) {
  res.render('shop', { title: 'Modules', message: 'Browse modules'})
})


app.post('/verify', function (req, res) {
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
    var request = sendCodeEmail(req.body.email, code);
    sg.API(request, (err, response) => {
      if(!err)
        res.status(200).send(`Verification email sent to ${req.body.email}`);
      else
        res.status(400).send('Failure sending mail');
    });
  })
})

var server = app.listen(port, function () {
  console.log(`Server started on port http://localhost:${port}`);
});

module.exports = server;
