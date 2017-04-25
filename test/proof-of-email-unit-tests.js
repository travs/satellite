const ProofOfEmail = artifacts.require('./ProofOfEmail.sol');
require('./integration-tests.js');

let instance;
let email = 'nycacevi@inboxbear.com';
let code = 'abc123';

describe('Proof of email contract', () => {
contract('ProofOfEmail', accounts => {
  let address = accounts[3];

  before('Preparation', () => {
    ProofOfEmail.deployed()
    .then(res => instance = res)
  });

  it('Correctly makes a puzzle function call', () => {
    token = web3.sha3(code);
    assert.doesNotThrow(() => {
      return instance.puzzle(
        address, web3.sha3(token, {encoding: 'hex'}),
        web3.sha3(email)
      )
      .then(res => assert.equal(res.logs[0].event, 'Puzzled'))
    })
  })
  it('Correctly makes confirm function call', () => {
    assert.doesNotThrow(() => {
      return instance.confirm(token, {from: address})
      .then(res => assert.equal(res.logs[0].event, 'Confirmed'))
    })
  })

})
})
