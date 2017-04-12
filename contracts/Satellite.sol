pragma solidity 0.4.8;

contract Satellite {

    string[] moduleNames;
    mapping (string => Module) moduleRegistry;

    struct Module {
        address owner;
        string moduleName;
        string url;
        int score;
        bool exists;
    }

    // MODIFIERS
    modifier moduleExists (string name) {
        if(moduleRegistry[name].exists) throw;
        _;
    }

    modifier moduleDoesNotExist (string name) {
        if(moduleRegistry[name].exists) throw;
        _;
    }

    modifier senderOwnsModule (string name) {
        if(moduleRegistry[name].owner != msg.sender) throw;
        _;
    }

    // CONSTRUCTOR
    function Satellite(){}

    // USER INTERFACE
    function registerModule (string name, string url) public
    moduleDoesNotExist(name) {
        //pre:  no module exists with this name or url
        //post: module with this name and url exists
    }

    function voteOnModule (string name, bool goodModule) public
    moduleExists(name) {
        //pre:  module with this name exists; sender is not module's owner
        //post: module with this name changes its score by +|- 1
    }

    function removeModule(string name) public
    moduleExists(name) senderOwnsModule(name) {
        //pre:  module with this name exists; sender is module's owner
        //post: no module with this name exists
    }
}
