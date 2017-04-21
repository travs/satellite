const Satellite = global.artifacts.require('Satellite');

//events
let registerEvent;
let deregisterEvent;
let satelliteInstance;
let moduleIndex = {};

// WATCH EVENTS
Satellite.deployed().then((res) => satelliteInstance = res)
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
      name: result.args.moduleName,
      owner: moduleData[0],
      url: moduleData[1],
      score: moduleData[2].toNumber(),
      created: new Date(moduleData[3]).toDateString()
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

module.exports = moduleIndex
