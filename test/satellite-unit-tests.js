const utils = require('contract-utils');
const extensions = utils.testing;
const Satellite = artifacts.require('./Satellite.sol');

contract("Satellite", function(accounts){
describe("Module registration", function(){
  it("does not error when registering module from outside contract", function(){
    return Satellite.deployed()
    .then(instance => assert.doesNotThrow(() =>
      instance.registerModule(
        'day-trader', 'modules.melonport.com/day-trader', {from: accounts[1]}
      )
    ));
  });
  it("errors on registration of module whose name is in use", function(){
    return Satellite.deployed()
    .then(instance => extensions.assertThrows(() =>
      instance.registerModule(
        'day-trader', 'modules.melonport.com/other-name', {from: accounts[2]}
      )
    ));
  });
})
describe("Module voting", function(){
  it("does not error on vote from non-owner of module", function(){
    return Satellite.deployed()
    .then(instance => assert.doesNotThrow(() =>
      instance.voteOnModule('day-trader', true, {from: accounts[2]})
    ));
  });
  it("increments module score on positive vote", function(){
    return Satellite.deployed()
    .then(instance => instance.showModule.call('day-trader'))
    .then(res => assert.equal(1, res[2]))
  });
  it("decrements module score on negative votes", function(){
    return Satellite.deployed()
    .then(instance => assert.doesNotThrow(() =>
      instance.voteOnModule('day-trader', false, {from: accounts[2]})
    ))
    .then(Satellite.deployed)
    .then(instance => assert.doesNotThrow(() =>
      instance.voteOnModule('day-trader', false, {from: accounts[3]})
    ))
    .then(Satellite.deployed)
    .then(instance => instance.showModule.call('day-trader'))
    .then(res => assert.equal(-1, res[2]))
  });
  it("errors when owner votes on own module", function () {
    return Satellite.deployed()
    .then(instance => extensions.assertThrows(() =>
      instance.voteOnModule('day-trader', true, {from: accounts[1]})
    ));
  });
})
describe("Data access", function(){
  it("returns module data on request", function(){
    return Satellite.deployed()
    .then(instance => instance.showModule.call('day-trader'))
    .then(res => assert.isNotNull(res))
  });
  it("lists registered modules when list function called");
})
describe("Module de-registration", function(){
  it("errors on de-registration of a non-existent module", function(){
    return Satellite.deployed()
    .then(instance => extensions.assertThrows(() =>
      instance.removeModule('nein')
    ))
  });
  it("errors on de-regestration for non-owner of module", function(){
    return Satellite.deployed()
    .then(instance => extensions.assertThrows(() =>
      instance.removeModule('day-trader', {from: accounts[2]})
    ))
  });
  it("does not error when owner calls for de-registration", function(){
    return Satellite.deployed()
    .then(instance => assert.doesNotThrow(() =>
      instance.removeModule('day-trader', {from: accounts[1]})
    ))
  });
  it("removes module when de-registered", function(){
    return Satellite.deployed()
    .then(instance => extensions.assertThrows(() =>
      instance.showModule.call('day-trader')
    ))
  });
})
})
