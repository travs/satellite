const Web3 = require('web3');
const contract = require('truffle-contract');
const satellite_artifacts = require('../build/contracts/Satellite.json');
const email_artifacts = require('../build/contracts/ProofOfEmail.json');

//contract instances
let satelliteInstance;
let emailVerifyInstance

//events
let registerEvent;
let deregisterEvent;
let requestedEvent;
let puzzledEvent;
let confirmedEvent;

let moduleIndex = {};

let provider = new Web3.providers.HttpProvider('http://localhost:8545');
let web3 = new Web3(provider);
let Satellite = contract(satellite_artifacts);
let ProofOfEmail = contract(email_artifacts);
Satellite.setProvider(provider);
ProofOfEmail.setProvider(provider);

// perform on satellite contract
Satellite.deployed()
.then(res => satelliteInstance = res)
.then(() => registerEvent = satelliteInstance.ModuleRegistered())
.then(() => deregisterEvent = satelliteInstance.ModuleRemoved())
.then(() => modifyEvent = satelliteInstance.EntryModified())
.then(() => {
  registerEvent.watch(onRegister);
  deregisterEvent.watch(onDeregister);
  modifyEvent.watch(onRegister);
})

function onRegister (err, result) {
  satelliteInstance.showModule(result.args.moduleName)
  .then(moduleData => {
    moduleIndex[result.args.moduleName] = {
      owner: moduleData[0],
      url: moduleData[1],
      score: moduleData[2].toNumber(),
      created: moduleData[3]
    }
    console.log('Indexed module entry for ' + result.args.moduleName);
    console.log(moduleIndex);
  })
}

function onDeregister (err, result) {
  delete moduleIndex[result.args.moduleName];
  console.log('Removed index entry for ' + result.args.moduleName);
  console.log(moduleIndex);
}

// perform on ProofOfEmail contract
ProofOfEmail.deployed()
.then(res => emailVerifyInstance = res)
.then(() => allEvents = emailVerifyInstance.allEvents())
.then(() => allEvents.watch((err,res) => console.log(res)))
// .then(() => requestedEvent = emailVerifyInstance.Requested())
// .then(() => puzzledEvent = emailVerifyInstance.Puzzled())
// .then(() => confirmedEvent = emailVerifyInstance.Confirmed())
// .then(() => requestedEvent.watch((err, res) => console.log(res)))
// .then(() => puzzledEvent.watch((err, res) => console.log(res)))
// .then(() => confirmedEvent.watch((err, res) => console.log(res)))
