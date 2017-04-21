// TRUFFLE GLOBALS
// NB: globals are generally an *anti-pattern*, but since we're dealing with a
// minimal app that runs on a single process, we can use them rather than
// resorting to the dependency injection (DI) pattern. When we scale this out,
// `truffle exec` may have evolved to accomodate us so we can avoid DI there too
// (see: https://git.io/v9JSx)
global.web3 = web3;
global.artifacts = artifacts;

const app = require('./app');
const moduleIndex = require('./module-index');
const port = 1776;

function startServer () {
  moduleIndex.startWatching();
  return app.listen(port, function () {
    console.log(`Server started on port http://localhost:${port}`);
  });
}

process.on('SIGINT', function() {
  console.log( "\nSIGINT detected, shutting down." );
  process.exit();
})

// CONDITIONAL EXPORT
if(process.argv.indexOf('exec') > -1) {
  //calling from `truffle exec`, so we must export a function
  var exported = (callback) => {
    startServer();
  }
} else {
  var exported = startServer();
}

module.exports = exported
