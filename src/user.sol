pragma solidity ^ 0.4.2;

contract User {

    address public user;
    address public lastDirAddress;
    string public provider;
     
    function User(address _dirAddress, string _provider) {
        user = msg.sender;
        lastDirAddress = _dirAddress;
        provider = _provider;
    }


    function getlastDirAddress() constant returns(address dirAddress) {
        return lastDirAddress;
    }

    function getProvider() constant returns(string provider) {
        return provider;
    }

    function setlastDirAddress(address dirAddress) {
        if (msg.sender == user) {
            lastDirAddress = dirAddress;
        }
    }

    function setProvider(string newProvider) {
        if (msg.sender == user) {
            provider = newProvider;
        }
    }

}
