$(document).ready(function(){

  function initialize() {
    var map;
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
      mapTypeId: 'roadmap',
    styles: [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}],
    panControl: false,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,      
    zoomControl: false


    };
                    
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("listings-map"), mapOptions);


    // create empty markers array which we will fill later
    var markers = [];


    // this iterates over our listing object which we create in the listings controller
    // and pushes them into the markers array
    
    function pushMarkers(markerVariable){


      $.each(markerVariable, function( index, value ) {

       //create lat long numbers 
       var listinglat = parseFloat(value.lat);
       var listinglng = parseFloat(value.lng);

       // set animation property
       // value.animation = google.maps.Animation.DROP;

       // create google maps marker object, passing in the prepped value
       var listingmarker = new google.maps.Marker(value);


       // var listingmarker = [value.building, listinglat, listinglng];

       // pass the marker into array
       markers.push(listingmarker);


      });

  

    // Display multiple markers on a map
    // var infoWindow = new google.maps.InfoWindow(), marker, i;
    // Loop through our array of markers & place each one on the map  
    $.each(markers, function(index,value){
        console.log("what is this? ", value)

        var position = new google.maps.LatLng(value.lat, value.lng);

        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map
        });
        



    //     // Automatically center the map fitting all markers on the screen
    //     map.fitBounds(bounds);
    // }

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);


      //content for the infoBox
      var contentString = 
      '<div class="map-pointer"></div>'+
      '<div class="map-listing-box" style="background: #FFF"; data-listing-lat="'+ value.lat +'" data-listing-lng="'+ value.lng +'">'+
        '<div class="listings-image" style="background-image:url(' + value.unit + ');">'+
          '<div class="listings-address">'+
            '<p>' + value.building + '</p>'+
          '</div>'+
        '</div>'+
        '<div class="bed">'+
          '<p>'+
            value.unit +
            '<span> bed</span>'+
          '</p>'+
        '</div>'+
        '<div class="bath">'+
          '<p>'+
            value.id +
            '<span> bath</span>'+
          '</p>'+
        '</div>'+
        '<div class="price">'+
          '<p>$' + value.price + '</p>'+
        '</div>'+
      '</div>';

      //create an info window object and set it as the info property of the marker. Alternatively, just
      // build a click handler on a marker which reveals a div near the markerwhich you can set the html to in
      // the above variable 'contentString' and style in a css stylesheet

      //styles for info box, uses google's infobox.js
      var infoBoxOptions = {
          content: contentString,
          disableAutoPan: false,
          maxWidth: 0,
          pixelOffset: new google.maps.Size(-142, -260),
          zIndex: null,
          boxStyle: { 
          position: "relative",  
          opacity: 1,
          width: "285px",
          height: "204px"
        },
          closeBoxMargin: "10px 2px 2px 2px",
          closeBoxURL: "",
          infoBoxClearance: new google.maps.Size(1, 1),
          isHidden: false,
          pane: "floatPane",
          enableEventPropagation: false
        };

      value.info = new InfoBox(infoBoxOptions);

      //close info window on zoom change      
      google.maps.event.addListener(map, 'zoom_changed', function() {
        value.info.close();
      });


      // when any given marker is clicked, all other markers' infowindows are closed
      // and the infowindow of the marker that was clicked on is opened
    
        // google.maps.event.addListener(marker, 'click', (function(marker, index) {
        //     return function() {
        //         infoWindow.setContent(infoWindowContent[i][0]);
        //         infoWindow.open(map, marker);
        //     }
        // })(marker, i));


      google.maps.event.addListener(marker, 'click', function() {
        $.each(markers, function(index, value){
          value.info.close();
  
        });

        value.info.open(map,marker);

      });

      window.zoomedPinClickCounter = 0;

      //add click event to info window which opens showpage
      google.maps.event.addListener(value.info, 'domready', function() {
        $(".infoBox").click(function(){

          $("a[data-listing-id='" + value.id + "']")[0].click();   
        })
      });
  
        value.setMap(null);

  
    }); //end markers loop


    } //end pushMarkers function     

    pushMarkers(gon.listings);

  // Sets the map on all markers in the array.
    function setAllMap(map) {
      console.log("last pass null in here")
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    function clearMarkers() {
      console.log("second hit here and jump back to set all with a value of null")
      setAllMap(null);
    }
            
    function deleteMarker() {
      console.log("DElete em!? ", markers)

      for (var i = 0; i < markers.length; i++) {
      console.log("hey!? ", markers[i])

        markers[i].setMap(null);
        markers[i] = null;
        console.log("new array? ", markers);
      }
        markers = []

    }




    // when any part of the map is clicked, close any markers' infowindows.
    google.maps.event.addListener(map, 'click', function() {
      $.each(markers, function(index, value){
        value.info.close();
      });
    });



    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });


    // listener for returning bounds, center, and zoom level when a user changes the zoom level
    google.maps.event.addListener(map, 'idle', function(ev){

      var bounds = map.getBounds();
      var ne = bounds.getNorthEast(); // LatLng of the north-east corner
      var sw = bounds.getSouthWest();
      var zoom = map.getZoom();
      var center = map.getCenter();
      console.log('ZOMBIE center is', center);


      var center_string = center.toString();
      console.log('ZOMBIE centerstring is', center_string);

      center_array = []
      center_string.split(',').map(function(str){
        str = str.replace()
        str = str.replace("(" , "");
        str = str.replace(")" , "");
        str = str.replace(" " , "");
        // str = str.substring(0,10);


        center_array.push(str)
      });

      var ne_string = ne.toString();
      var sw_string = sw.toString();

 
      var neArray = []
      ne_string.split(',').map(function(str){
        str = str.replace("(" , "");
        str = str.replace(")" , "");
        str = str.replace(" " , "");
        neArray.push(str);
      });

      var swArray = []
      sw_string.split(',').map(function(str){
        str = str.replace("(" , "");
        str = str.replace(")" , "");
        str = str.replace(" " , "");
        swArray.push(str);
      });

      //adjust the coordinates in the url on map pane
      var stateObj = { foo: "bar" };
      history.pushState(stateObj, "title", "?zoom="+zoom+"&center_lat="+center_array[0]+"&center_lon="+center_array[1]);

      // refresh listings on right side of page to only show listings
      // within current map bounds

   
      google.maps.event.addListener(map, 'dragend', function() { 

      var currentListings = [];
      console.log("YOO YOO: ", markers)
      currentListings = markers.map(function(marker){ return marker.id});
      console.log("currentListings: ", currentListings)

       $.ajax({
            type: 'post',
            url: '/listings/refresh',
            proccessData: false,
            data: {sw_lat: swArray[0], sw_lon: swArray[1], ne_lat: neArray[0], ne_lon: neArray[1], current_listings: currentListings},
            dataType: 'JSON',
            success:function(data) {

              $(data).each(function(index,value){
                console.log("data BUILDING: ", value.building) 

              })
              console.log("*********************************")

                deleteMarker()

            // deleteMarkers();
            // pushMarkers(data);
    
            }
          });

      });



    });



    //sets zoom controls on map
    var homeControlDiv = document.createElement('div');
    var homeControl = new HomeControl(homeControlDiv, map);

    //creates event on custom zoom controls
    function HomeControl(controlDiv, map) {

     google.maps.event.addDomListener(zoomout, 'click', function() {
       var currentZoomLevel = map.getZoom();
       if(currentZoomLevel != 0){
         map.setZoom(currentZoomLevel - 1);}     
      });

       google.maps.event.addDomListener(zoomin, 'click', function() {
       var currentZoomLevel = map.getZoom();
       if(currentZoomLevel != 21){
         map.setZoom(currentZoomLevel + 1);}
      });

    }



    
  } //INITALIZE

  initialize();

}); //doc ready




// google.maps.event.addDomListener(window, 'load', init);

// function init() {
//     // Basic options for a simple Google Map
//     // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
//     var myLatlng = new google.maps.LatLng(40.7127, -74.0059);

//     var mapOptions = {
//         // How zoomed in you want the map to start at (always required)
//         scrollwheel: false,
//         zoom: 14,
//         panControl: false,
//         mapTypeControl: false,
//         scaleControl: true,
//         streetViewControl: false,      
//         zoomControl: true,
//         zoomControlOptions: {
//           style: google.maps.ZoomControlStyle.SMALL
//         },
//         // The latitude and longitude to center the map (always required)
//         center: myLatlng,

//         // How you would like to style the map. 
//         // This is where you would paste any style found on Snazzy Maps.
//         styles: [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}]
//     };

//     var markers = [];

//     $.each(gon.listings, function( index, value ) {

//      //create lat long object 
//      var listinglatLng = new google.maps.LatLng(value.lat,
//         value.lng);

//      // pass the lat long object into the position property of the object
//      value.position = listinglatLng;

//      // set animation property
//      value.animation = google.maps.Animation.DROP;

//      // create google maps marker object, passing in the prepped value
//      var listingmarker = new google.maps.Marker(value);

//      // pass the marker into array
//      markers.push(listingmarker);

//     });

//     // Get the HTML DOM element that will contain your map 
//     // We are using a div with id="map" seen below in the <body>
//     var mapElement = document.getElementById('map');

//     // Create the Google Map using out element and options defined above
//     var map = new google.maps.Map(mapElement, mapOptions);

//     // map.panBy(300,0);

//     var marker = new google.maps.Marker({
//         position: myLatlng,
//         map: map,
//         title: 'Urbalet',
//         icon: '/assets/map-pin.png'
//     });
// }