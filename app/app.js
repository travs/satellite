const Web3 = require('web3');
const contract = require('truffle-contract');
const satellite_artifacts = require('../build/contracts/Satellite.json');

let moduleIndex = {};
let contractInstance;
let registerEvent;
let deregisterEvent;

let provider = new Web3.providers.HttpProvider('http://localhost:8545');
let web3 = new Web3(provider);
let Satellite = contract(satellite_artifacts);
Satellite.setProvider(provider);

Satellite.deployed()
.then(res => contractInstance = res)
.then(() => registerEvent = contractInstance.ModuleRegistered())
.then(() => deregisterEvent = contractInstance.ModuleRemoved())
.then(() => {
  registerEvent.watch((err, result) => {
    contractInstance.showModule(result.args.moduleName)
    .then(moduleData => {
      moduleIndex[result.args.moduleName] = {
        owner: moduleData[0],
        url: moduleData[1],
        score: moduleData[2].toNumber(),
        created: moduleData[3]
      }
      console.log('Indexed module entry for ' + result.args.moduleName);
    })
  })

  deregisterEvent.watch((err, result) => {
    delete moduleIndex[result.args.moduleName];
    console.log('Removed index entry for ' + result.args.moduleName);
  })
})
