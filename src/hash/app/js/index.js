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
          
          $("#divTransactionsResult").append("<p>"+"  tx hash          : " + e.hash + "<br>"
            + "   nonce           : " + e.nonce + "<br>"
            + "   blockHash       : " + e.blockHash + "<br>"
            + "   blockNumber     : " + e.blockNumber + "<br>"
            + "   transactionIndex: " + e.transactionIndex + "<br>"
            + "   from            : " + e.from + "<br>" 
            + "   to              : " + e.to + "<br>"
            + "   value           : " + e.value + "<br>"
            + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "<br>"
            + "   gasPrice        : " + e.gasPrice + "<br>"
            + "   gas             : " + e.gas + "<br>"
            + "   input           : " + e.input)+"</p>";

            // console.log("  tx hash          : " + e.hash + "\n"
            // + "   nonce           : " + e.nonce + "\n"
            // + "   blockHash       : " + e.blockHash + "\n"
            // + "   blockNumber     : " + e.blockNumber + "\n"
            // + "   transactionIndex: " + e.transactionIndex + "\n"
            // + "   from            : " + e.from + "\n" 
            // + "   to              : " + e.to + "\n"
            // + "   value           : " + e.value + "\n"
            // + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
            // + "   gasPrice        : " + e.gasPrice + "\n"
            // + "   gas             : " + e.gas + "\n"
            // + "   input           : " + e.input)+"\n"; 
        }
      })
    }
  }
};

$(document).ready(function() {

  $("#walletButton").click(function() {
    var account = $("#walletID").val();
    $("#spanAddressWallet").html(account);
    getTransactionsByAccount(account);	
  });

    $("#providerButton").click(function() {
    var value = $("#providerID").val();
    Provider.set(value);
  });

      $("#currentValue").click(function() {
    Provider.get().then(function(value) {
      $(".value").html(value);
    });
  });


});
