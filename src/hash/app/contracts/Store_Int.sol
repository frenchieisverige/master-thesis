pragma solidity ^0.4.2;

contract StoreInt {
  uint public storedData;

  function StoreInt(uint initialValue) {
    storedData = initialValue;
  }

  function set(uint x) {
    storedData = x;
  }

  function get() constant returns (uint retVal) {
    return storedData;
  }

}
