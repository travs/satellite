var Satellite = artifacts.require("./Satellite.sol");
var ProofOfEmail = artifacts.require("./ProofOfEmail.sol");

module.exports = function(deployer) {
  deployer.deploy(ProofOfEmail)
  .then(() =>
    deployer.deploy(Satellite, ProofOfEmail.address)
  )
};
