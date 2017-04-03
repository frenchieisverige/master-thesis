var Web3 = require('web3');
var solc = require('solc');
var ipfsAPI = require('ipfs-api');
const fs = require('fs');

//Globals
var docContract = {
    abi: null,
    address: null
};

var filePath = process.argv[4];

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
function addtoIPFS(path, callbackDocDeploy) {
    ipfs.util.addFromFs(path, {
        recursive: false
    }, (err, result) => {
        if (err) {
            throw err
        }
        let link = "https://ipfs.io/ipfs" + "/" + result[0].hash;
        console.log('File uploaded to IPFS: '+result[0].hash);
	console.log('link:'+link);    
	callbackDocDeploy(link);
    });
	//console.log('link:'+link);    
	//callbackDocDeploy(link);
}

//Setting up the account 
web3.eth.defaultAccount = web3.eth.accounts[0];
var account = web3.eth.accounts[0];

function compileAndDeployDocContract(link) {

    //updatating lastDocAddress in directory.sol
    var dirABI = JSON.parse(fs.readFileSync('./directoryABI.js', 'utf8'));
    var directoryContract = web3.eth.contract(dirABI);
    var dirSC = directoryContract.at(process.argv[6]);

    var userWallet = process.argv[2];
    var docAddress = process.argv[3];
    var name = process.argv[5];
    let source = fs.readFileSync('./document.sol', 'utf8');
    let compiledContract = solc.compile(source, 1);
    let abi = compiledContract.contracts['Document'].interface;
    fs.writeFile('./documentABI.js', abi, (err) => {
  if (err) throw err;
  console.log('documentABI.js saved!');
});
    let bytecode = compiledContract.contracts['Document'].bytecode;
    let gasEstimate = web3.eth.estimateGas({
        data: bytecode
    });
    //run out of gas when using this
    let docContract = web3.eth.contract(JSON.parse(abi));

    //Contract Object parameters
    var deployContractObject = {
        from: account,
        data: bytecode,
        gas: '4700000'
    };

    var docSC = docContract.new(userWallet, docAddress, link, name, deployContractObject, function(err, docSC) {
        if (!err) {
            // NOTE: The callback will fire twice!
            // Once the contract has the transactionHash property set and once its deployed on an address.

            // e.g. check tx hash on the first call (transaction send)
            if (!docSC.address) {
                console.log('DocumentTransaction Hash: ' + docSC.transactionHash) // The hash of the transaction, which deploys the contract

                // check address on the second call (contract deployed)
            } else {
                console.log('DocumentContract Mined! address: ' + docSC.address); // the contract address
		//dirSC.setlastDocAddress(docSC.address);
		//console.log(docSC.address);                
		dirSC.setlastDocAddress(docSC.address);
                //send transaction to user in order to save it to settings
            }
           
            // Note that the returned "myContractReturned" === "myContract",
            // so the returned "myContractReturned" object will also get the address set.
        }
        else { console.log(err);}
    });
 
}

addtoIPFS(filePath,compileAndDeployDocContract);
