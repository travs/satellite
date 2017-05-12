const request = require('supertest');
const moduleIndex = require('../server/module-index');
require('./satellite-unit-tests.js')

describe('Tests of our minimal server', () => {
contract('ProofOfEmail', accounts => {
  let email = 'nycacevi@inboxbear.com';
  let address = accounts[3];

  before(() => server = require('../server/server.js'));
  after(() => server.close(moduleIndex.stopWatching()));

  it('Responds to GET /', () => {
    request(server)
    .get(`/`)
    .expect(200)
  })
  it('Responds to GET /verification', () => {
    request(server)
    .get(`/verification`)
    .expect(200)
  })
  it('Responds to GET /modules', () => {
    request(server)
    .get(`/modules`)
    .expect(200)
  })
  it('Responds to POST /verification', () => {
    request(server)
    .post(`/verification`)
    .send({email: email, address: address})
    .expect(200)
  })
})
})
