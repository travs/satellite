const Satellite = global.artifacts.require('Satellite');
const ProofOfEmail = global.artifacts.require('ProofOfEmail');

//events
let registerEvent;
let deregisterEvent;
let satelliteInstance;
let poeEvents;
let index = {};

// WATCH EVENTS
function startWatching() {
  Satellite.deployed().then((res) => satelliteInstance = res)
  .then(() => registerEvent = satelliteInstance.ModuleRegistered())
  .then(() => deregisterEvent = satelliteInstance.ModuleRemoved())
  .then(() => modifyEvent = satelliteInstance.EntryModified())
  .then(ProofOfEmail.deployed)
  .then(instance => poeEvents = instance.allEvents())
  .then(() => {
    registerEvent.watch(onRegister);
    deregisterEvent.watch(onDeregister);
    modifyEvent.watch(onRegister);
    poeEvents.watch((err,res) => {
      if(err)
        console.log(err)
      console.log(res);
    });
  })
}

function stopWatching() {
  registerEvent.stopWatching(() => console.log('Stopped watching register'));
  deregisterEvent.stopWatching(() => console.log('Stopped watching deregister'));
  modifyEvent.stopWatching(() => console.log('Stopped watching modify'));
  poeEvents.stopWatching(() => console.log('Stopped watching ProofOfEmail'));
}

function onRegister (err, result) {
  satelliteInstance.showModule(result.args.moduleName)
  .then(moduleData => {
    index[result.args.moduleName] = {
      name: result.args.moduleName,
      owner: moduleData[0],
      url: moduleData[1],
      score: moduleData[2].toNumber(),
      created: new Date(moduleData[3]).toDateString()
    }
    console.log('Indexed module entry for ' + result.args.moduleName);
  })
}

function onDeregister (err, result) {
  delete index[result.args.moduleName];
  console.log('Removed index entry for ' + result.args.moduleName);
}

module.exports = {index, startWatching, stopWatching}
