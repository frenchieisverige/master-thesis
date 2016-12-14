/**
 * Created by emmanuel on 14.12.16.
 */

var ipfsAPI = require('ipfs-api')
var Web3 = require('web3');

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})
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

//Add file from system to IPFS
ipfs.util.addFromFs('/home/visy/ipfs/test/testfile.txt', { recursive: false }, (err, result) => {
  if (err) {
    throw err
  }
		    var URL = "https://ipfs.io/ipfs" + "/" + result[0].hash;
                    console.log(URL);
})

//Setting up the account 
var account = web3.eth.accounts[0];

//abi file generated out of the smart contract (solidity browser)
var abiArray = 
[{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storedHash","type":"string"}],"payable":false,"type":"function"}];

//bytecode out of the smart contract
var bytecode = '606060405234610000575b6101d5806100186000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480634ed3885e146100435780636d4ce63c1461009a575b610000565b3461000057610098600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610115565b005b34610000576100a76101ba565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156101075780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b8060009080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061016157805160ff191683800117855561018f565b8280016001018555821561018f579182015b8281111561018e578251825591602001919060010190610173565b5b5090506101b491905b808211156101b0576000816000905550600101610198565b5090565b50505b50565b60206040519081016040528060008152602001508090505b9056';

//Contract Object parameters
var deployContractObject = {
from: account, 
     data: bytecode, 
     gas: '4700000'
};
//Creation of a new contract
var storeipfshashContract = web3.eth.contract(abiArray);

var storeipfshash = storeipfshashContract.new(deployContractObject, function (err, contract){
                if (err) {
                    console.error('Error deploying contract: ', err);
    //console.log(e, contract);
    } else if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    
                } else {
                    console.error('Unknown error deploying contract');
                }
 })
