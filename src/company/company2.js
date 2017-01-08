var ipfsAPI = require('ipfs-api')
var Web3 = require('web3');

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

//Globals
var hash;

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {
    protocol: 'http'
});
ipfs.swarm.peers(function(err, response) {
    if (err) {
        console.error(err);
    } else {
        console.log("IPFS - connected to " + response.toString().length + " peers");
        //console.log(response);
    }
});


// create an instance of web3 using the HTTP provider.
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
if (!web3.isConnected()) {
    console.error("Ethereum - no conection to RPC server");
} else {
    console.log("Ethereum - connected to RPC server");
}
//Setting up the account 
web3.eth.defaultAccount = web3.eth.accounts[0];
var sender = web3.eth.accounts[0];
var receiver = process.argv[3];
var receiver2 = web3.eth.accounts[1];

console.log('Web3: '+receiver2);
console.log('Receiver: '+receiver);
function addfile(url) {
    console.log('You are adding a document with the following path: ' + url);
    ipfs.util.addFromFs(url, {
        recursive: false
    }, (err, result) => {
        if (err) {
            throw err
        }
        hash = result[0].hash;
        myEmitter.emit('StoredHash');
        //console.log('hash stored: '+hash);


    })
}

//addfile to IPFS
addfile(process.argv[2]);

myEmitter.on('StoredHash', () => {
    var URL = "https://ipfs.io/ipfs" + "/" + hash;
    //Send transaction
    web3.eth.sendTransaction({from:sender ,to:receiver,value:web3.toWei(1,"ether"),data:web3.toHex(URL)});
    console.log('You can find your document here: ' + URL);
});




