//! originally by Gavin Wood (https://git.io/v9IjF)
pragma solidity ^0.4.0;

contract Certifier {
	event Confirmed(address indexed reverse);
	event Revoked(address indexed reverse);

	function certified(address _who) constant returns (bool);
	function lookup(address _who, string _field) constant returns (string) {}
	function lookupHash(address _who, string _field) constant returns (bytes32);
}
