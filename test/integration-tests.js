const Bluebird = require('bluebird');
const utils = require('contract-utils');
const extensions = utils.testing;
const Satellite = artifacts.require('./Satellite.sol');
const ProofOfEmail = artifacts.require('./ProofOfEmail.sol');

let accounts;
let satelliteInstance;
let proofOfEmailInstance;
let getAccts = Bluebird.promisify(web3.eth.getAccounts);

describe('Tests that require Satellite and ProofOfEmail', () => {

before('Preparation', () => {
  return getAccts()
  .then(res => accounts = res)
  .then(() => Satellite.deployed())
  .then(res => satelliteInstance = res)
  .then(() => ProofOfEmail.deployed())
  .then(res => proofOfEmailInstance = res)
  .then(() => {
    return satelliteInstance.registerModule(
      'night-trader', 'modules.melonport.com/night-trader',
      {from: accounts[1]}
    )
  })
})

describe("Module voting", () => {
  it("errors when owner votes on own module", () => {
    return extensions.assertThrows(() =>
      satelliteInstance.voteOnModule('night-trader', true, {from: accounts[1]})
    );
  });
  it("errors when unverified address attempts to vote", () => {
    return extensions.assertThrows(() =>
      satelliteInstance.voteOnModule('night-trader', true, {from: accounts[2]})
    )
  })
  it("does not error when forcing email confirmation", () => {
    assert.doesNotThrow(() =>
      proofOfEmailInstance.overrideConfirm(accounts[2], web3.sha3('a@b.co'))
    )
  })
  it("does not error on vote from verfied, non-owner of module", () => {
    assert.doesNotThrow(() =>
      satelliteInstance.voteOnModule('night-trader', true, {from: accounts[2]})
    )
  });
  it("increments module score on positive vote", () => {
    satelliteInstance.showModule.call('night-trader')
    .then(res => assert.equal(1, res[2]))
  });
  it("decrements module score on negative votes", () => {
    satelliteInstance.voteOnModule('night-trader', false, {from: accounts[2]})
    .then(() => {
      assert.doesNotThrow(() =>
        satelliteInstance.voteOnModule('night-trader', false, {from: accounts[3]})
      )
    })
    .then(() =>
      satelliteInstance.showModule.call('night-trader')
    )
    .then(res => assert.equal(-1, res[2]))
  });
})
})
