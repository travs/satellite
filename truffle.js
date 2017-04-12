const TestRPC = require("ethereumjs-testrpc");

module.exports = {
  networks: {
    development: {
      network_id: "*", // Match any network id
      provider: new TestRPC.provider()
    }
  },
  mocha: {
    slow: 3000,
    reporter: 'spec'
  }
};
