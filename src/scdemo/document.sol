pragma solidity ^ 0.4.2;

contract Document {

    address public user;
    address public previousDocAddress;
    string public docLink;
    string public docName;
    address public owner;
    uint public docTime;

    function Document(address _userWallet, address _docAddress, string _link, string _name) {
        user = _userWallet;
        previousDocAddress = _docAddress;
        docLink = _link;
        docName = _name;
	owner = msg.sender;
        docTime = now;
    }

    function getPreviousDocAddress() constant returns(address scAddress) {
        return previousDocAddress;
    }

    function getdocLink() constant returns(string link) {
        return docLink;
    }

    function getUser() constant returns(address user) {
        return user;
    }

    function getOwner() constant returns(address owner) {
        return owner;
    }

    function getdocName() constant returns(string name) {
        return docName;
    }

    function getdocTime() constant returns(uint time) {
        return docTime;
    }    

    function setLink(string link) {
        if (msg.sender == user) {
            docLink = link;
        }
    }

}
