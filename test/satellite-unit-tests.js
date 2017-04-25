const utils = require('contract-utils');
const extensions = utils.testing;
const Satellite = artifacts.require('./Satellite.sol');

require('./proof-of-email-unit-tests.js');

contract("Satellite", accounts => {

let instance;
before('Preparation', () => {
  Satellite.deployed()
  .then(res => instance = res)
});

describe("Module registration", () => {
  it("does not error when registering module from outside contract", () => {
    assert.doesNotThrow(() => {
      return instance.registerModule(
        'day-trader', 'modules.melonport.com/day-trader', {from: accounts[1]}
      )
    })
  });
  it("errors on registration of module whose name is in use", () => {
    return extensions.assertThrows(() => {
      return instance.registerModule(
        'day-trader', 'modules.melonport.com/other-name', {from: accounts[2]}
      )
    })
  });
});
describe("Entry modification", () => {
  it("does not error when modifying URL of an entry", () => {
    assert.doesNotThrow(() =>
      instance.modifyEntry('day-trader', 'newsite.io', {from: accounts[1]})
    )
  });
  it("stored the changed URL after it is modified", () => {
    return instance.showModule.call('day-trader')
    .then(res => assert.equal(res[1].toString(), 'newsite.io'));
  });
})
describe("Data access", () => {
  it("returns module data on request", () => {
    return instance.showModule.call('day-trader')
    .then(res => assert.isNotNull(res))
  });
})
describe("Module de-registration", () => {
  it("errors on de-registration of a non-existent module", () => {
    return extensions.assertThrows(() => instance.removeModule('nein'))
  });
  it("errors on de-regestration for non-owner of module", () => {
    return extensions.assertThrows(() =>
      instance.removeModule('day-trader', {from: accounts[2]})
    )
  });
  it("does not error when owner calls for de-registration", () => {
    assert.doesNotThrow(() =>
      instance.removeModule('day-trader', {from: accounts[1]})
    )
  });
  it("removes module when de-registered", () => {
    return extensions.assertThrows(() =>
      instance.showModule.call('day-trader')
    )
  });
})
})
