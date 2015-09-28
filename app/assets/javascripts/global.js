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

  //************************************************************
  //NEHIGBORHOOD SETUP
  //************************************************************

  //set up neighborhood
  window.addNeighborhood = function addNeighborhood(value){
    var currentNeighborhood = $(".load-neighborhood").data("neighborhood");
    var chooseCity = $(".choose-city select").val();
    var pullCity = "New York";
    // var pullCity = $("#listings-map").data("city");
    if(value){
      var selectedValue = value;
    }else if(chooseCity){
      var selectedValue = chooseCity;
    }else{
      var selectedValue = pullCity;
    }; //
    //pull neighborhoods on selection of city
    var url = "/assets/neighborhood.json";
    //empty select if selection has been made
    if(chooseCity || pullCity){
      $(".load-neighborhood select").empty().closest(".input-container").addClass("validate validate-chosen").find(".input-blocker").removeClass("start-block").end().end().append("<option value=''></option>");            
    }else{
      $(".load-neighborhood select").empty().closest(".input-container").removeClass("validate validate-chosen error").find(".input-blocker").addClass("start-block");             
    }

    $.getJSON(url, function (area) {
      $.each(area, function (index, value){

        //if map page
        if(pullCity){
          var useValue = value.neighborhood_id;
        }else{
          var useValue = value.neighborhood;
        }

        if(value.city == selectedValue){
          $(".load-neighborhood select").append("<option data-area='{\"area\":\""+value.area+", "+value.state+"\"}' value='"+useValue+"'>"+value.neighborhood+"</option>")
        }; //end if -> city
      }); //end each -> area
      
      //set selectize
      if($(".load-neighborhood select").length){
        $(".load-neighborhood select").selectize({
          persist: false,
          maxItems: 1,
          dataAttr: 'data-area',
          valueField: 'value',
          labelField: 'name',
          searchField: 'name',
          render: {
            option: function(data, escape) {
              return '<div class="content-option">'
              + data.name
              + '<span class="area"> '+data.area+'</span> '
              + '</div>';
            },
            item: function(data, escape){
              return '<div class="selected-option">'
              + data.name
              + ', <span class="area"> '+data.area+'</span> '
              + '</div>';
            }
          },
          onChange: function(value){
            //send to functon to update map position
            window.goToNeighborhood(value);
          }
        }); //end selectize
      }; //end if -> length

    }); //end json -> neighborhood

  }; //end function -> addNeighborhood

  //run
  window.addNeighborhood();

  
}); //doc reay