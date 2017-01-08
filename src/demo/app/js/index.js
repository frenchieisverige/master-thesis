/*globals $, SimpleStorage, document*/

var addToLog = function(txt) {
  $(".logs").append("<br>" + txt);
};

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
        if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
          
            $('#transactions').append('<tr><td>' + e.from + 
        '</td><td>' + '<a href=' + web3.toAscii(e.input) +'>' + e.hash + '</a>' + 
        '</td><td>' + new Date(block.timestamp * 1000).toGMTString()+')</td></tr>');

            console.log(//"  tx hash          : " + e.hash + "\n"
            // + "   nonce           : " + e.nonce + "\n"
            // + "   blockHash       : " + e.blockHash + "\n"
            // + "   blockNumber     : " + e.blockNumber + "\n"
            // + "   transactionIndex: " + e.transactionIndex + "\n"
              "   from            : " + e.from + "\n" 
            // + "   to              : " + e.to + "\n"
            // + "   value           : " + e.value + "\n"
             + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
            // + "   gasPrice        : " + e.gasPrice + "\n"
            // + "   gas             : " + e.gas + "\n"
             + "   input           : " + web3.toAscii(e.input))+"\n"; 
        }
      })
    }
  }
};

$(document).ready(function() {

  $("#walletButton").click(function() {
    var account = $("#walletText").val();
console.log('Account: '+account);
    getTransactionsByAccount(account);	
  });




});
