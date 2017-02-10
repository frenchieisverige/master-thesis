var Web3 = require('web3');
var solc = require('solc');
const fs = require('fs');

//Globals
var dirContract = {
    abi: null,
    address: null
};

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

//Setting up the account 
web3.eth.defaultAccount = web3.eth.accounts[0];
var account = web3.eth.accounts[0];

function compileAndDeployDirContract() {
    var userWallet = process.argv[2];
    var docAddress = process.argv[3];
    let source = fs.readFileSync('./directory.sol', 'utf8');
    let compiledContract = solc.compile(source, 1);
    let abi = compiledContract.contracts['Directory'].interface;
    fs.writeFile('./directoryABI.js', abi, (err) => {
  if (err) throw err;
  console.log('directoryABI.js saved!');
});
    let bytecode = compiledContract.contracts['Directory'].bytecode;
    let gasEstimate = web3.eth.estimateGas({
        data: bytecode
    });
    //run out of gas when using this
    let userContract = web3.eth.contract(JSON.parse(abi));

    //Contract Object parameters
    var deployContractObject = {
        from: account,
        data: bytecode,
        gas: '4700000'
    };

    var userSC = userContract.new(userWallet, docAddress, deployContractObject, function(err, dirSC) {
        if (!err) {
            // NOTE: The callback will fire twice!
            // Once the contract has the transactionHash property set and once its deployed on an address.

            // e.g. check tx hash on the first call (transaction send)
            if (!dirSC.address) {
                console.log('DirectoryTransaction Hash: ' + dirSC.transactionHash) // The hash of the transaction, which deploys the contract

                // check address on the second call (contract deployed)
            } else {
                console.log('DirectoryContract Mined! address: ' + dirSC.address) // the contract address
                //send transaction to user in order to save it to settings
            }

            // Note that the returned "myContractReturned" === "myContract",
            // so the returned "myContractReturned" object will also get the address set.
        }
        else { console.log(err);}
    });
}

compileAndDeployDirContract();
