$(document).ready(function(){
 
 
  //highlight current page
  var pageType = $("#pagetype").attr("class");
  var subPageType = $("#pagetype").attr("data-sub-page");

  $("#"+pageType).addClass("active").closest(".admin-sidebar-link").next("ul.sidebar-subnav").show();
  $("."+subPageType).addClass("active");


  //handle link responses and toggle subnavs for sidebar
  $(".admin-sidebar-link").click(function(e){
    e.preventDefault();
    var ifActive = $(this).find("li.sidebar-nav").hasClass("active");
    var ifSubNav = $(this).hasClass("stack");

    if(ifSubNav == true){
      $(this).next("ul.sidebar-subnav").slideToggle();  
    }else if(ifActive == true){
    }else{
      window.location = $(this).attr("href");
    }
  
  })

});