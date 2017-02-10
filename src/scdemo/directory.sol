pragma solidity ^ 0.4.2;

contract Directory {

    address public company;	
    address public user;
    address public lastDocAddress;
    address public previousDirAddress;
    
    
    function Directory(address _user, address _dirAddress) {
        company = msg.sender;
        user = _user;
        previousDirAddress = _dirAddress; 
 

    }


    function getlastDocAddress() constant returns(address lastDocAddress) {
        return lastDocAddress;
    }

    function getpreviousDirAddress() constant returns(address previousDirAddress) {
        return previousDirAddress;
    }


    function setlastDocAddress(address SCAddress) {
        if (msg.sender == company) {
            lastDocAddress = SCAddress;
        }
}

    function setpreviousDirAddress(address dirAddress) {
        if (msg.sender == user) {
            previousDirAddress = dirAddress;
        }
    }




}
