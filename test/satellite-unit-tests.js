const Satellite = artifacts.require('./Satellite.sol');

contract("Satellite", function(accounts){
  it("registers module when function called from outside contract");
  it("increments module's score on positive vote");
  it("decrements module's score on negative vote");
  it("de-registers module when function called from outside contract");
  it("lists registered modules when list function called");
})
