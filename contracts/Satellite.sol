pragma solidity 0.4.8;

contract Satellite {

    string[] public moduleNames;
    mapping (string => Module) private moduleRegistry;

    struct Module {
        address owner;
        string moduleName;
        string url;
        int score;
        bool exists;
    }

    // MODIFIERS
    modifier moduleExists (string name) {
        if(!moduleRegistry[name].exists) throw;
        _;
    }

    modifier moduleDoesNotExist (string name) {
        if(moduleRegistry[name].exists) throw;
        _;
    }

    modifier moduleOwner (string name) {
        if(moduleRegistry[name].owner != msg.sender) throw;
        _;
    }

    modifier notModuleOwner (string name) {
        if(moduleRegistry[name].owner == msg.sender) throw;
        _;
    }

    // CONSTRUCTOR
    function Satellite(){}

    // USER INTERFACE
    function registerModule (string name, string url) public
    moduleDoesNotExist(name) {
        //pre:  no module exists with this name
        //post: module with this name exists
        moduleRegistry[name] = Module({
            owner: msg.sender,
            moduleName: name,
            url: url,
            score: 0,
            exists: true
        });
    }

    function voteOnModule (string name, bool goodModule) public
    moduleExists(name) notModuleOwner(name) {
        //pre:  module with this name exists; sender is not module's owner
        //post: module with this name changes its score by +|- 1
        if(goodModule)
            moduleRegistry[name].score += 1;
        else
            moduleRegistry[name].score -= 1;
    }

    function removeModule (string name) public
    moduleExists(name) moduleOwner(name) {
        //pre:  module with this name exists; sender is module's owner
        //post: no module with this name exists
    }

    function showModule (string name) public constant
    moduleExists(name) returns (address owner, string url, int score) {
        //returns: module data for module called `name`
        //NOTE: implemented since getter not compiler-generated
        //(see: https://github.com/ethereum/solidity/issues/498)
        Module mod = moduleRegistry[name];
        return (mod.owner, mod.url, mod.score);
    }
}
