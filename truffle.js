const TestRPC = require('ethereumjs-testrpc');

module.exports = {
  networks: {
    development: {
      network_id: '*', // Match any network id
      provider: new TestRPC.provider()
    },
    binary: {
      network_id: '*',
      host: 'localhost',
      port: 8545
    }
  },
  mocha: {
    slow: 3000,
    reporter: 'spec'
  }
};
