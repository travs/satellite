var Satellite = artifacts.require("./Satellite.sol");
var ProofOfEmail = artifacts.require("./ProofOfEmail.sol");

module.exports = function(deployer) {
  deployer.deploy(Satellite);
  deployer.deploy(ProofOfEmail);
};
