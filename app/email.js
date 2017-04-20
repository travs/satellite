const sg = require('../node_modules/sendgrid')(process.env.SENDGRID_API_KEY);
const helper = require('../node_modules/sendgrid').mail;

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

module.exports = {
  sendCodeEmail
}
