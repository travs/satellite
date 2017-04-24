//! originally by Gavin Wood (https://git.io/v9Ij1)
pragma solidity ^0.4.0;

contract ReverseRegistry {
	event ReverseConfirmed(string indexed name, address indexed reverse);
	event ReverseRemoved(string indexed name, address indexed reverse);

	function hasReverse(bytes32 _name) constant returns (bool);
	function getReverse(bytes32 _name) constant returns (address);
	function canReverse(address _data) constant returns (bool) {}
	function reverse(address _data) constant returns (string) {}
}
