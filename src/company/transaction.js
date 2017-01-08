var Web3 = require('web3');

// create an instance of web3 using the HTTP provider.
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
if (!web3.isConnected()) {
    console.error("Ethereum - no conection to RPC server");
} else {
    console.log("Ethereum - connected to RPC server");
}

//Setting up the account 
web3.eth.defaultAccount = web3.eth.accounts[0];
    web3.eth.sendTransaction({from:web3.eth.accounts[0] ,to:web3.eth.accounts[1],value:web3.toWei(1,"ether"),data:web3.toHex("bduazidbazudioazd")});
console.log("Transaction sent");





