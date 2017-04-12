pragma solidity 0.4.8;

contract Satellite {

    struct Module {
        string name;
        string url;
        int score;
    }

    // CONSTRUCTOR
    function Satellite(){}

    // USER INTERFACE
    function registerModule (string name, string url) public {
        //pre:  no module exists with this name or url
        //post: module with this name and url exists
    }

    function voteOnModule (string name, bool goodModule) public {
        //pre:  module with this name exists; sender is not module's owner
        //post: module with this name changes its score by +|- 1
    }

    function removeModule(string name) public {
        //pre:  module with this name exists; sender is module's owner
        //post: no module with this name exists
    }
}
