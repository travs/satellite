const request = require('supertest');

describe('Tests of our minimal server', () => {
contract('ProofOfEmail', accounts => {
  let email = 'nycacevi@inboxbear.com';
  let address = accounts[3];

  before(() => server = require('../app/server.js'));
  after(() => server.close());

  it('Responds to GET /', () => {
    request(server)
    .get(`/`)
    .expect(200)
    .end((err, res) => assert.isNull(err))
  })
  it('Responds to GET /verification', () => {
    request(server)
    .get(`/verification`)
    .expect(200)
    .end((err, res) => assert.isNull(err))
  })
  it('Responds to GET /shop', () => {
    request(server)
    .get(`/shop`)
    .expect(200)
    .end((err, res) => assert.isNull(err))
  })
  it('Responds to POST /verify', () => {
    request(server)
    .post(`/verify`)
    .send({email: email, address: address})
    .expect(200)
    .end((err, res) => assert.isNull(err))
  })
})
})
