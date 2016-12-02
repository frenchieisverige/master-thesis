pragma solidity ^0.4.2;
contract Provider {
  string public provider;

  function SimpleStorage(string initialValue) {
    provider = initialValue;
  }

  function set(string x) {
    provider = x;
  }

  function get() constant returns (string retVal) {
    return provider;
  }

}
