const Satellite = artifacts.require('./Satellite.sol');

contract("Satellite", function(accounts){
  it("does not error when registering module from outside contract", function(){
    return Satellite.deployed()
    .then(instance => assert.doesNotThrow(() =>
      instance.registerModule(
        'day-trader', 'modules.melonport.com/day-trader', {from: accounts[1]}
      )
    ));
  });
  it("returns module data on request", function(){
    return Satellite.deployed()
    .then(instance => instance.showModule.call('day-trader'))
    .then(res => assert.isNotNull(res))
  });
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
  it("errors when owner votes on own module");
  it("de-registers module when function called from outside contract");
  it("lists registered modules when list function called");
  it("errors on registration of a module whose name is already in use");
  it("errors on de-registration of a non-existent module");
  it("errors on de-regestration for non-owner of module");
})
