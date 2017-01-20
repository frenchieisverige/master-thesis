var ipfsAPI = require('ipfs-api')
var Web3 = require('web3');
const EventEmitter = require('events');

//Globals
var GlobalContract = {
    Hash: null,
    Address: null,
    CurrentData: null,
    Instance: null
};

var recipent = process.argv[3];
var filePath = process.argv[2];

// create instance of IPFS locally
var ipfs = ipfsAPI('localhost', '5001', {
    protocol: 'http'
});

//connect to testRPC / Geth locally
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

// Checking Ethereum connection status
if (!web3.isConnected()) {
    console.error("Ethereum - no conection to RPC server");
} else {
    console.log("Ethereum - connected to RPC server");
}

// connect to ipfs daemon API server
ipfs.swarm.peers(function(err, response) {
    if (err) {
        console.error(err);
    } else {
     console.log("IPFS - connected to " + response.toString().length + " peers");
    }
});

//adding file to IPFS
ipfs.util.addFromFs(filePath, {
    recursive: false
}, (err, result) => {
    if (err) {
        throw err
    }
    GlobalContract.Hash = result[0].hash;
    //console.log(GlobalContract.Hash);

});

//Setting up the account 
web3.eth.defaultAccount = web3.eth.accounts[0];
var account = web3.eth.accounts[0];

//abi file generated out of the smart contract (solidity browser)
var abiArray = [{
    "constant": true,
    "inputs": [],
    "name": "docLink",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "link",
        "type": "string"
    }],
    "name": "setLink",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getBlockNumber",
    "outputs": [{
        "name": "blockNumber",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "setblockNumberAndHash",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "blockNumber",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getSCAddress",
    "outputs": [{
        "name": "scAddress",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "link",
        "type": "bytes32"
    }],
    "name": "setLinkLog",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "_scAddress",
        "type": "address"
    }, {
        "name": "_lastSCAddress",
        "type": "address"
    }],
    "name": "Directory",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getlastSCAddress",
    "outputs": [{
        "name": "scAddress",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getLink",
    "outputs": [{
        "name": "link",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "lastSCAddress",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "scAddress",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "blockHash",
    "outputs": [{
        "name": "",
        "type": "bytes32"
    }],
    "payable": false,
    "type": "function"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "link",
        "type": "bytes32"
    }],
    "name": "documentLink",
    "type": "event"
}];

//bytecode out of the smart contract
var bytecode = '606060405234610000575b610812806100196000396000f300606060405236156100c3576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318fd4026146100c857806319337d6c1461015e57806342cbb15c146101b55780634b3004ee146101d857806357e871e7146101e7578063591cec861461020a57806387880a881461025957806395b4d1b41461027a578063acee60c2146102cc578063e2d84e231461031b578063e5eb5264146103b1578063ede980f714610400578063f22a195e1461044f575b610000565b34610000576100d561047a565b6040518080602001828103825283818151815260200191508051906020019080838360008314610124575b80518252602083111561012457602082019150602081019050602083039250610100565b505050905090810190601f1680156101505780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34610000576101b3600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610518565b005b34610000576101c26105bd565b6040518082815260200191505060405180910390f35b34610000576101e56105c6565b005b34610000576101f46105de565b6040518082815260200191505060405180910390f35b34610000576102176105e4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610000576102786004808035600019169060200190919050506105ed565b005b34610000576102ca600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610630565b005b34610000576102d96106b7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610000576103286106e2565b6040518080602001828103825283818151815260200191508051906020019080838360008314610377575b80518252602083111561037757602082019150602081019050602083039250610353565b505050905090810190601f1680156103a35780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34610000576103be610794565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100005761040d6107ba565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100005761045c6107e0565b60405180826000191660001916815260200191505060405180910390f35b60048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105105780601f106104e557610100808354040283529160200191610510565b820191906000526020600020905b8154815290600101906020018083116104f357829003601f168201915b505050505081565b8060049080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061056457805160ff1916838001178555610592565b82800160010185558215610592579182015b82811115610591578251825591602001919060010190610576565b5b5090506105b791905b808211156105b357600081600090555060010161059b565b5090565b50505b50565b60008090505b90565b4360008190555060005440600181600019169055505b565b60005481565b60008090505b90565b7fd39dec70ba79fea2d72fbc0c57b9283c64b0c689529c0af9f92699d6d42c36ff8160405180826000191660001916815260200191505060405180910390a15b50565b81600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5050565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b602060405190810160405280600081525060048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107895780601f1061075e57610100808354040283529160200191610789565b820191906000526020600020905b81548152906001019060200180831161076c57829003601f168201915b505050505090505b90565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600154815600a165627a7a7230582021d7cc6d8b8354938f99fb0c05e9e4b2032553339f66be444049d512666deddd0029';

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
var documentContract = web3.eth.contract(abiArray);

//Deploying contract on the blockchain and save link
var sc = documentContract.new(deployContractObject, function(e, contract) {
    //console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
        console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
        web3.eth.sendTransaction({
            from: account,
            to: recipent,
            value: web3.toWei(1, "ether"),
            data: contract.address
        });
        sc.setLink(GlobalContract.Hash);
        var result = sc.getLink.call();
        var URL = "https://ipfs.io/ipfs" + "/" + result;
        console.log('You can find your document here: ' + URL);
    }
});