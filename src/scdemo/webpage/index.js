var Web3 = require('web3');

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

documentABI = [{"constant":true,"inputs":[],"name":"docLink","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"link","type":"string"}],"name":"setLink","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPreviousDocAddress","outputs":[{"name":"scAddress","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getdocTime","outputs":[{"name":"time","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"user","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"docName","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getUser","outputs":[{"name":"user","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"owner","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getdocLink","outputs":[{"name":"link","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getdocName","outputs":[{"name":"name","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"previousDocAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"docTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_userWallet","type":"address"},{"name":"_docAddress","type":"address"},{"name":"_link","type":"string"},{"name":"_name","type":"string"}],"payable":false,"type":"constructor"}];

directoryABI = [{"constant":true,"inputs":[],"name":"getpreviousDirAddress","outputs":[{"name":"previousDirAddress","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dirAddress","type":"address"}],"name":"setpreviousDirAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"user","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"company","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"previousDirAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"SCAddress","type":"address"}],"name":"setlastDocAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getlastDocAddress","outputs":[{"name":"lastDocAddress","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastDocAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_user","type":"address"},{"name":"_dirAddress","type":"address"}],"payable":false,"type":"constructor"}];

userABI = [{"constant":false,"inputs":[{"name":"newProvider","type":"string"}],"name":"setProvider","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"provider","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getProvider","outputs":[{"name":"provider","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"user","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"dirAddress","type":"address"}],"name":"setlastDirAddress","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastDirAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getlastDirAddress","outputs":[{"name":"dirAddress","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_dirAddress","type":"address"},{"name":"_provider","type":"string"}],"payable":false,"type":"constructor"}];

var userSCAddress = process.argv[2];

web3.eth.defaultAccount = web3.eth.accounts[0];
var account = web3.eth.accounts[0];

function updateDocumentList(userSCAddress){


    var userContract = web3.eth.contract(userABI);
    var userSC = userContract.at(userSCAddress);
    //Getting last DirAddress
    var dirAddress = userSC.getlastDirAddress.call();
    console.log('DirAddress: '+dirAddress);
    //creating instance of last DirAddress
    var dirContract = web3.eth.contract(directoryABI)
    var dirSC = dirContract.at(dirAddress);
    // retrieving last DocAddress
    var docAddress = dirSC.lastDocAddress.call();
    console.log('docAddress: '+ docAddress);

    while (dirAddress!=="0x0000000000000000000000000000000000000000"){
        while (docAddress!=="0x0000000000000000000000000000000000000000"){
 
   var docContract = web3.eth.contract(documentABI);
   var docSC = docContract.at(docAddress);

            var name = docSC.getdocName.call();
	    var link = docSC.getdocLink.call();
            var from = docSC.getOwner.call();
            var time = docSC.getdocTime.call();
            var date = new Date(time*1000).toGMTString();

        $('#transactions').append('<tr><td>' + from + 
        '</td><td>' + '<a href=' + link +'>' + name + '</a>' + 
        '</td><td>' + date+')</td></tr>'); 
     console.log('From: '+ from + ' Link: '+ link +  'Name: '+ name + ' Date: '+date); 

        docAddress = docSC.getPreviousDocAddress();

        }
    dirAddress = dirSC.getpreviousDirAddress();
    } 
} 

$(document).ready(function() {

  $("#walletButton").click(function() {
    var usrAddress = $("#walletText").val();
    console.log('Account: '+ usrAddress);
    updateDocumentList(usrAddress);	
  });
});

//updateDocumentList(userSCAddress);




