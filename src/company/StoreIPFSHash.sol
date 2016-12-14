pragma solidity ^0.4.2;

contract StoreIPFSHash {
  string storedHash;

  function set(string x) {
    storedHash = x;
  }

  function get() constant returns (string storedHash) {
    return storedHash;
  }

}
