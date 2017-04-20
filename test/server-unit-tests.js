const request = require('supertest');

describe('Tests of our minimal server', () => {
contract('ProofOfEmail', accounts => {
  let email = 'nycacevi@inboxbear.com';
  let address = accounts[3];

  before(() => server = require('../app/app.js'));
  after(() => server.close());

  it('Responds to /address/:address/email/:email', () => {
    request(server)
    .post(`/address/${address}/email/${email}`)
    .expect(200)
    .end((err, res) => assert.isNull(err))
  })
})
})
