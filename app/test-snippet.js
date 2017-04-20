//temp

module.exports = function(callback){
  const ProofOfEmail = artifacts.require('./ProofOfEmail.sol');
  let emailVerifyInstance;
  let token;
  let code = 'abc123';
  let email = 'nycacevi@inboxbear.com';
  let address = web3.eth.accounts[3];
  return ProofOfEmail.deployed()
  .then(instance => emailVerifyInstance = instance)
  .then(() => {
    // return emailVerifyInstance.request(web3.sha3(email), {from: address})
  })
  .then(() => {
    token = web3.sha3(code);
    return emailVerifyInstance.puzzle(
      address, web3.sha3(token, {encoding: 'hex'}), web3.sha3(email),
      {from: web3.eth.accounts[0]}
    )
  })
  .then(() => {
    return emailVerifyInstance.confirm(token, {from: address});
  })
}
