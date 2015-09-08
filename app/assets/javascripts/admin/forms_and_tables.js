$(document).ready(function(){

    // $('.resize img').centerImage();


  //FORMS

  //wrap grouped select boxes if needed
  $(".input-container.select-third").find("select").wrap('<div class="select-container third"></div>');

  //for companies' filters - find the max amount of contacts on the page
  var maxCount = 0;
  $(".contacts-count").each(function(){
    $this = parseInt($(this).text());
    if ($this > maxCount) maxCount = $this;
  })
  
  //change background color of "switch" checkboxes 
  

  $(".slider-container input[type=checkbox]").each(function(){

    if($(this).is(":checked")){
      $(this).closest(".slider-container").css({"background-color": "#3498db"});
    }

  })

  $(".slider-container input[type=checkbox]").click(function(){
    var thisChecked = $(this);

    if(thisChecked.is(":checked")){
      thisChecked.closest(".slider-container").delay(150).fadeIn(3000, function(){
        $(this).css({"background-color": "#3498db"});
      }); 
    }else{
      thisChecked.closest(".slider-container").delay(150).fadeIn(3000, function(){
        $(this).css({"background-color": "#e5e5e5"});
      }); 
    };
  });

//Change text color of select boxes after option is chosen
  $("select").change(function() {
    $(this).find("option:selected").each(function() {
      if($(this).val()==""){
        $(this).parent().css({"color" : "#8f8f8f"});
      }else{
        $(this).parent().css({"color" : "#000"});
      }
    });
  });

  //toggle filters container
  $(".filters-button").click(function(){
    $(this).toggleClass("active");
    $(".admin-filters-wrapper").slideToggle();  

    //trigger range slider when filters button is clicked
    $("#contact-range").ionRangeSlider({
      min: 0,
      max: maxCount,
      type: 'double',
      onChange: function (obj) { 
        var minValue = obj.fromNumber;
        var maxValue = obj.toNumber;
      }
    });

  })

  //open search-box
  var searchBoxStatus = 0;
  $(".search-button").click(function(){
    if(searchBoxStatus == 0){
      $(this).addClass("active");
      $(this).find("input").show().animate({"width":"200px"}, 100);
      $(".close-search").show();
      searchBoxStatus = 1;
    }else if(searchBoxStatus == 1){

      searchBoxStatus = 0;
    }
  })

  //close search-box
  $(".close-search").click(function(e){
    $(this).hide();
    $(this).closest(".search-button").removeClass("active").find("input").animate({"width":"0px"}, 100, function(){
      $(this).hide();
    });
    searchBoxStatus = 0;
    e.stopPropagation();
  });

  //send email to contacts on index pages
  $(".checkbox-container input[type=checkbox]").click(function(){

    //if there is nothing checked thus the button is disabled
    if (($(".admin-box-wrapper .checkbox-container input:checkbox:checked").length > 0) && $(".send-email-button").hasClass("disabled") ){
      $(".send-email-button").removeClass("disabled").addClass("active").find("p.filters-text").html("Send").end().find(".send-email-select-container").show().animate({"width":"200px"}, 100);

    //there are other checked items but the button has already been enabled and do nothing
    }else if ($(".admin-box-wrapper .checkbox-container input:checkbox:checked").length > 0){

    //there are no current checked inputs, disable button
    }else{
      $(".send-email-button").find(".send-email-select-container").animate({"width":"0"}, 100, function(){
        $(".send-email-button").find(".send-email-select-container").hide().end().removeClass("active").addClass("disabled").find("p.filters-text").html("Select Contacts");
      });
    }

  })

  //chosen
  var config = {
    '.chosen-select'           : {},
    '.chosen-select-deselect'  : {allow_single_deselect:true},
    '.chosen-select-no-single' : {disable_search_threshold:10},
    '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
    '.chosen-select-width'     : {width:"95%"}
  }
  for (var selector in config) {
    $(selector).chosen(config[selector]);
  }

  //datepicker
  var filterCounter = 1;

  $('.datepicker-container').each(function() {
    
    var picker = new Pikaday({
        format: "ddd, MMM DD, YYYY",
        firstDay: 1,
        field: document.getElementById('filter-date-start'+filterCounter),
        minDate: new Date('2000-01-01'),
        maxDate: moment().toDate(),
        yearRange: [2000,2020],
        onSelect: function() {
          picker2.setMinDate(this.getDate());
        }
    });

    var picker2 = new Pikaday({
        format: "ddd, MMM DD, YYYY",
        firstDay: 1,
        field: document.getElementById('filter-date-end'+filterCounter),
        minDate: new Date('2000-01-01'),
        maxDate: moment().toDate(),
        yearRange: [2000,2020],
        onSelect: function() {
          picker.setMaxDate(this.getDate());
        }
    });

    filterCounter++;

  });

  //change checkbox behavior to act like radio
  $("input.checkbox-to-radio").click(function(){
    if($(this).is(":checked")){
      $(this).closest(".checkbox-container").siblings(".checkbox-container").find("input.checkbox-to-radio").prop("checked", false);
    }

  })


  //TABLES

  //target areas of a row to be clicked to show page
  $("td.cell-link").click(function(){
    var destination = $(this).parent().find(".crud-show").attr("href");
    window.location = destination;
  })

  //select all checkboxes
  $("#all-contacts").change(function(){
    var findAction = $(this).val();

    if(findAction == "All"){
      $("input[type=checkbox]").prop("checked", true);

      //if there is nothing checked thus the button is disabled
      if (($(".admin-box-wrapper .checkbox-container input:checkbox:checked").length > 0) && $(".send-email-button").hasClass("disabled") ){
        $(".send-email-button").removeClass("disabled").addClass("active").find("p.filters-text").html("Send").end().find(".send-email-select-container").show().animate({"width":"200px"}, 100);

      //there are other checked items but the button has already been enabled and do nothing
      }else if ($(".admin-box-wrapper .checkbox-container input:checkbox:checked").length > 0){

      }

    }else if(findAction == "None"){
      $("input[type=checkbox]").prop("checked", false);

      $(".send-email-button").find(".send-email-select-container").animate({"width":"0"}, 100, function(){
        $(".send-email-button").find(".send-email-select-container").hide().end().removeClass("active").addClass("disabled").find("p.filters-text").html("Select Contacts");
      });

    }

  });


}); //doc ready