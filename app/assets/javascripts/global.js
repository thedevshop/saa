$(document).ready(function(){

  //modal
  $("body").on("click", ".open-modal", function(e){
    e.preventDefault();
    var id = $(this).data("unit-id");
    $("#apt-id").val(id);
    $(".modal").fadeIn(200);
  })

  $("body").on("click", ".modal-close", function(e){
    e.preventDefault();
    $(".modal").fadeOut(200);
  })


  //resize + center images
  function resizeImages(){
    $('.resize img').centerImage();
  }

  resizeImages();

  $(window).resize(resizeImages);


  //***********************************************
  //noUI Slider
  //***********************************************

  if($("#price-range").length){
    $("#price-range").noUiSlider({
      start: [0, 5000],
      connect: true,
      range: {
        'min': 0,
        'max': 5000
      },
      format: wNumb({
        decimals: 0
      }),
    });

    $("#price-range").on({
      change: function() {
        $("#unit-refiner").submit();
      }
    })

    $("#price-range").Link('lower').to($(".filters-result.from span"), function ( value ) {
      // The tooltip HTML is 'this', so additional
      // markup can be inserted here.
      $(this).html(value);
    });

    // Tags after '-inline-' are inserted as HTML.
    // noUiSlider writes to the first element it finds.
    $("#price-range").Link('upper').to($(".filters-result.to span"), function ( value ) {
      // The tooltip HTML is 'this', so additional
      // markup can be inserted here.
      $(this).html(value);
    });

    $("#price-range").Link('lower').to($('#filters_price_from'));
    $("#price-range").Link('upper').to($('#filters_price_to'));
  };// end if

  //***********************************************
  //SUBMIT FORM -> BED/BATH/PETS
  //***********************************************

  $(".filters-btn").click(function(e){
    e.preventDefault();
    var this_ = $(this);
    var pullValue = this_.data("value");
    var inputLocation;

    if(this_.hasClass("pets")){
      this_.toggleClass("active");
      inputLocation = this_.next("input");
    }else{
      this_.toggleClass("active").siblings().removeClass("active");
      inputLocation = this_.closest(".filters-btn-container").find("input");

    }; //end if/else -> has pets

    //loop through all options and see if any are active, if not then clear the value of the hidden field
    this_.closest(".filters-btn-container").find(".filters-btn").each(function(){
      if(!this_.hasClass("active")){
       inputLocation.val("");
      }else{
       inputLocation.val(pullValue);
      };
    });

    //submit form
    $("#unit-refiner").submit();

  }); //end click -> .filters-btn


  
})