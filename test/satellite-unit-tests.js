const Satellite = artifacts.require('./Satellite.sol');

contract("Satellite", function(accounts){
  it("does not error when registering module from outside contract", function(){
    return Satellite.deployed()
    .then(function(instance){
      assert.doesNotThrow(() =>
        instance.registerModule(
          'day-trader', 'modules.melonport.com/day-trader', {from: accounts[1]}
        )
      );
    })
  });
  it("returns module data on request", function(){
    return Satellite.deployed()
    .then(instance => instance.showModule.call('day-trader'))
    .then(res => assert.isNotNull(res))
  });
  it("increments module's score on positive vote");
  it("decrements module's score on negative vote");
  it("de-registers module when function called from outside contract");
  it("lists registered modules when list function called");
  it("errors on registration of a module whose name is already in use");
  it("errors on de-registration of a non-existent module");
  it("errors on de-regestration for non-owner of module");
})
