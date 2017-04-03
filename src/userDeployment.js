var Web3 = require('web3');
var solc = require('solc');
const fs = require('fs');

//Globals
var userContract = {
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

function compileAndDeployUserContract() {
    var dirAddress = process.argv[2];
    var provider = process.argv[3];
    let source = fs.readFileSync('./user.sol', 'utf8');
    let compiledContract = solc.compile(source, 1);
    let abi = compiledContract.contracts['User'].interface;
    fs.writeFile('./userABI.js', abi, (err) => {
  if (err) throw err;
  console.log('userABI.js saved!');
});
    let bytecode = compiledContract.contracts['User'].bytecode;
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

    var userSC = userContract.new(dirAddress, provider, deployContractObject, function(err, usrSC) {
        if (!err) {
            // NOTE: The callback will fire twice!
            // Once the contract has the transactionHash property set and once its deployed on an address.

            // e.g. check tx hash on the first call (transaction send)
            if (!usrSC.address) {
                console.log('UserTransaction Hash: ' + usrSC.transactionHash) // The hash of the transaction, which deploys the contract

                // check address on the second call (contract deployed)
            } else {
                console.log('UserContract Mined! address: ' + usrSC.address) // the contract address
                //send transaction to user in order to save it to settings
            }

            // Note that the returned "myContractReturned" === "myContract",
            // so the returned "myContractReturned" object will also get the address set.
        }
        else { console.log(err);}
    });
}

compileAndDeployUserContract();
