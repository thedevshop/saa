//need to define outside of scope
var containerSize;

$(window).load(function(){
  //prevent multiple clicks while carousel runs, after click set flag to 'true'...
  //..when slider is done animating set back to 'false'

  window.imgSlider = function(){
    $(".listings-slide-container").each(function(){
      var imageCount = $(this).find(".img-container").length;
      containerSize = $(this).closest(".listings-img-container").width();

      $(this).css({"width":(containerSize*imageCount)+"px"});
      $(this).find(".img-container").css({"width":containerSize+"px"});

    }); //each

  }

  window.imgSlider();

  $(window).resize(function(){
    window.imgSlider();
  });

  //arrow click events -> pass to function
  $("body").on("click", ".left-arrow", function(e){
    e.preventDefault();
    carousel_left(this)
  });

  $("body").on("click", ".right-arrow", function(e){
    e.preventDefault();
    carousel_right(this)
  });


}); //win load

  //set up arrow click events as a function for infowindows
  //define outside load so it's not scoped
  var clickStatus = false;

  function carousel_right(el){
    var slideContainer = $(el).closest(".listings-img-wrapper").find(".listings-slide-container");
    var imageCount = slideContainer.find(".img-container").length;
    if(clickStatus == false){
      clickStatus = true;
      slideContainer.animate({"left":"-"+containerSize+"px"},function(){
        $(this).find(".img-container").each(function(index, value){
          if(index == 0){
            $(this).clone().appendTo(slideContainer).end().end().remove();
          }//if index 0
          slideContainer.css({"left":"0px"});
          clickStatus = false;
        }); //each
      }); //animate
    }; //if clickstatus
  }; //end function -> carousel_right


  function carousel_left(el){
    var slideContainer = $(el).closest(".listings-img-wrapper").find(".listings-slide-container");
    var imageCount = slideContainer.find(".img-container").length;

    if(clickStatus == false){
      clickStatus = true;
      slideContainer.find(".img-container").eq(imageCount-1).clone().prependTo(slideContainer).end().end().remove();
      slideContainer.css({"left":"-"+containerSize+"px"});

      slideContainer.animate({"left": "0px"}, function(){
        clickStatus = false;//callback
      });//animate
    };//if clickstatus
  }; //end function -> carousel_left


  function open_modal(id){
    var id = $(this).data("unit-id");
    $("#apt-id").val(id);
    $(".modal").fadeIn(200);            
  }



