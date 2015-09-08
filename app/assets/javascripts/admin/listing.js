$(function() {
  $("input#listing_address").on("keyup", function(e){
    var val = $(this).val();
    $("input#listing_name").val(val);
  });
})