var addToLog = function(txt) {
  $(".logs").append("<br>" + txt);
};

$(document).ready(function() {

  $("button.set").click(function() {
    var value = parseInt($("input.text").val(), 10);
    StoreInt.set(value);
    addToLog("StoreInt.set(" + value + ")");
  });

  $("button.get").click(function() {
    StoreInt.get().then(function(value) {
      $(".value").html(value.toNumber());
    });
    addToLog("StoreInt.get()");
  });

});
