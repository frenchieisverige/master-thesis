var jsonfile = require('jsonfile');
var Web3 = require('web3');

var scList = [];
var documentJSON = [];
var file = './data.json';

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

function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
  
  if (endBlockNumber == null) {
    endBlockNumber = web3.eth.blockNumber;
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - endBlockNumber;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }

  
  console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
      console.log("Searching block " + i);
    }

    var block = web3.eth.getBlock(i, true);
    if (block != null && block.transactions != null) {
      block.transactions.forEach( function(e) {
        if ((myaccount == e.from || myaccount == e.to) & ((e.input).length == 42)) {
           //console.log('type de e-input: '+ typeof(e.input));
           //console.log('e.input: '+ e.input);
           item = {}
           item ["TxPayLoad"] = String(e.input);
           item ["TxFrom"] = e.from;
           item ["TxDate"] = new Date(block.timestamp * 1000).toGMTString();
           item ["TxHash"] = e.hash;
           
           documentJSON.push(item);
        }
      })
    }
  }
//var liste = filteringList(scList);
//createJSON(liste);
//console.log('JSON:' + r);
//createSC(liste);
jsonfile.writeFile(file, documentJSON, function (err) {
  console.error(err)
})

}

function filteringList(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

/*function createJSON(liste) {
    addressJSON.address.push(liste);

}
*/
function createSC(filteredList) {
  filteredList.forEach(function(element) {
    var documentContract = web3.eth.contract(abiArray);
    // instantiate by address
    var sc = documentContract.at(element);
    var result = sc.getLink.call();
    var URL = "https://ipfs.io/ipfs" + "/" + result;
    console.log(URL);


  
  })
}

getTransactionsByAccount(process.argv[2]);
readJSON(file);

function readJSON(file) {
  jsonfile.readFile(file, function(err, obj) {
  //console.dir(obj);
  for(var i = 0; i < obj.length; i++) {
    var j = obj[i];
    var documentContract = web3.eth.contract(abiArray);
    // instantiate by address
    var sc = documentContract.at(j.TxPayLoad);
    var result = sc.getLink.call();
    var URL = "https://ipfs.io/ipfs" + "/" + result;
    console.log('URL: '+ URL + "From: "+ j.TxFrom + "Date: "+ j.TxDate);

/*     $('#transactions').append('<tr><td>' + j.TxFrom + 
        '</td><td>' + '<a href=' + URL +'>' + j.TxHash + '</a>' + 
        '</td><td>' + j.TxDate+')</td></tr>');*/

}
})
}