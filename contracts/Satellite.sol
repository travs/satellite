pragma solidity ^0.4.8;

import './ProofOfEmail.sol';

contract Satellite {

    mapping (string => Module) private moduleRegistry;
    ProofOfEmail verificationContract;

    struct Module {
        address owner;
        string moduleName;
        string url;
        uint created;
        int score;
        bool exists;
    }

    // EVENTS
    event ModuleRegistered(string moduleName);
    event ModuleRemoved(string moduleName);
    event EntryModified(string moduleName);

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

    modifier isVerified (address addr) {
        if(!verificationContract.certified(addr)) throw;
        _;
    }

    // CONSTRUCTOR
    function Satellite(address emailContract){
        verificationContract = ProofOfEmail(emailContract);
    }

    // USER INTERFACE

    //pre:  no module exists with this name
    //post: module with this name exists
    function registerModule (string name, string url) public
        moduleDoesNotExist(name)
    {
        moduleRegistry[name] = Module({
            owner: msg.sender,
            moduleName: name,
            url: url,
            created: now,
            score: 0,
            exists: true
        });
        ModuleRegistered(name);
    }

    //pre:  module entry exists; sender is module's owner
    //post: module entry data changed (URL for now)
    function modifyEntry (string name, string newUrl) public
        moduleExists(name)
        moduleOwner(name)
    {
        Module entry = moduleRegistry[name];
        entry.url = newUrl;
        EntryModified(name);
    }

    //pre:  module with this name exists; sender is module's owner
    //post: no module with this name exists
    function removeModule (string name) public
        moduleExists(name)
        moduleOwner(name)
    {
        delete moduleRegistry[name];
        ModuleRemoved(name);
    }

    //pre:  module with this name exists; sender is not module's owner
    //post: module with this name changes its score by +|- 1
    function voteOnModule (string name, bool goodModule) public
        moduleExists(name)
        notModuleOwner(name)
        isVerified(msg.sender)
    {
        if(goodModule)
            moduleRegistry[name].score += 1;
        else
            moduleRegistry[name].score -= 1;
    }

    // CONSTANT FUNCTIONS

    //pre: module with name exists
    //returns: module data for module called `name`
    function showModule (string name) public constant
        moduleExists(name)
        returns (address owner, string url, int score, uint created)
    {
        //NOTE: implemented since getter not compiler-generated
        //(see: https://github.com/ethereum/solidity/issues/498)
        Module mod = moduleRegistry[name];
        return (mod.owner, mod.url, mod.score, mod.created);
    }
}
