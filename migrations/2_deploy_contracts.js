var Satellite = artifacts.require("./Satellite.sol");

module.exports = function(deployer) {
  deployer.deploy(Satellite);
};
