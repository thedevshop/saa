$(document).ready(function(){
  //resize + center images
  function resizeImages(){
    $('.resize img').centerImage();
  }

  resizeImages();

  $(window).resize(resizeImages);
  
})