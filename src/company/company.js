var ipfsAPI = require('ipfs-api')
var Web3 = require('web3');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();


myEmitter.on('ContractDeployed', () => {
    addfile(process.argv[2]);
});

myEmitter.on('StoredHash', () => {
     storeipfshash.set(GlobalContract.Hash);
    console.log('Document stored inside the blockchain!');
    var result = storeipfshash.get.call();
    var URL = "https://ipfs.io/ipfs" + "/" + result;
    console.log('You can find your document here: ' + URL);

});

//Globals
var GlobalContract = {
    Hash: null,
    Address: null,
    CurrentData: null,
    Instance: null
};

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

function addfile(url) {
    console.log('You are adding a document with the following path: ' + url);
    ipfs.util.addFromFs(url, {
        recursive: false
    }, (err, result) => {
        if (err) {
            throw err
        }
        GlobalContract.Hash = result[0].hash;
        myEmitter.emit('StoredHash');


    })
}


//Setting up the account 
web3.eth.defaultAccount = web3.eth.accounts[0];
var account = web3.eth.accounts[0];

//abi file generated out of the smart contract (solidity browser)
var abiArray = [{
    "constant": false,
    "inputs": [{
        "name": "x",
        "type": "string"
    }],
    "name": "set",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "get",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}];

//bytecode out of the smart contract
var bytecode = '606060405234610000575b6102b9806100196000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680634ed3885e146100495780636d4ce63c146100a0575b610000565b346100005761009e600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610136565b005b34610000576100ad6101db565b60405180806020018281038252838181518152602001915080519060200190808383600083146100fc575b8051825260208311156100fc576020820191506020810190506020830392506100d8565b505050905090810190601f1680156101285780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b8060009080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061018257805160ff19168380011785556101b0565b828001600101855582156101b0579182015b828111156101af578251825591602001919060010190610194565b5b5090506101d591905b808211156101d15760008160009055506001016101b9565b5090565b50505b50565b602060405190810160405280600081525060008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102825780601f1061025757610100808354040283529160200191610282565b820191906000526020600020905b81548152906001019060200180831161026557829003601f168201915b505050505090505b905600a165627a7a723058206ac7a1ab2c0be917683a0b3b37b2bc91164476353da0c95f4fe1368ccf2be5690029';
//Contract Object parameters
var deployContractObject = {
    from: account,
    data: bytecode,
    gas: '4700000'
};

var sendDataObject = {
    from: account,
    gas: '4700000'
};

//Creation of a new contract
var storeipfshashContract = web3.eth.contract(abiArray);

//Deploying contract on the blockchain
var storeipfshash = storeipfshashContract.new(deployContractObject, function(e, contract) {
    //console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
        console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
        //console.log('code at adress'+web3.eth.getCode(contract.address));
        myEmitter.emit('ContractDeployed');
    }
});
