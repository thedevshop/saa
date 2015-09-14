//map function
function initialize() {
  //********************

  if($("#listings-map").length){
    //Set up variables
    //pull city from URL
    var location = $("#listings-map").data("city")

    var map;
    var center = new google.maps.LatLng(40.4000, -3.7167);
    window.markers = [];
    window.multiStackedInfoBoxes = [];

    //empty variable for info windows
    var innerContent;
    var infoWindowHeight;
    
    //used to determine if a multi-listing info window is open when the map is clicked on
    var stackedInfoClicked = 0;
    
    //create map options
    var mapOptions = {
      'zoom': 12,
      'center': center,
      'mapTypeId': google.maps.MapTypeId.ROADMAP,
      styles: [{featureType: "poi", stylers: [{ visibility: "off" }]}],
      panControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,      
      scrollwheel: false,
      zoomControl: false,
      maxZoom: 18
    };
                    

    // Set map variable to display map on the page with above options
    map = new google.maps.Map(document.getElementById("listings-map"), mapOptions);

    //find location by name
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': location }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
      }
    });


    //********************
    //Push listings into array

    // global function to create markers
    window.globalPushMarkers = function pushMarkers(markerVariable){

      //iterate through the array of markers
      $.each(markerVariable, function( index, value ) {

      //create lat long object 
      var listinglatLng = new google.maps.LatLng(value.lat,value.lng);

      // pass the lat long object into the position property of the object
      value.position = listinglatLng;

      // set animation property for pin drop
      // value.animation = google.maps.Animation.DROP;

      // create google maps marker object, passing in each object
      var listingmarker = new google.maps.Marker(value);

      // push the marker into the empty array
      window.markers.push(listingmarker);

    }); //end globalPushMarkers function

    //********************
    //Create Markers

    //pass markers array and map to MarkerClusterer and set as global variable

    var mcOptions = {gridSize: 70, maxZoom: 18, zoomOnClick: false};
    window.markerCluster = new MarkerClusterer(map, window.markers, mcOptions);


    //loop through markers array to set infowindows and other event listeners
    $.each(window.markers, function(index,value){

      //set custom single icon
      value.setIcon("/assets/map-pin.png");

      var singleContent = createInfoWindowContent(value, "single")
      createInfoWindow(value, singleContent, "single")

      //OLD CODE FOR SINGLE MARKERS, BUT EVERYTHING IS REGISTERED AS A CLUSTER
      //click event for info window, close all other single and multi markers and open info window of clicked object
      google.maps.event.addListener(value, 'click', function() {

        //run close functions to hide infowindows that may be open
        closeSingleInfoWindow(window.markers);

        //open currently clicked info window
        value.info.open(map,value);

      });

      //add click event to info window which goes to showpage
      // google.maps.event.addListener(value.info, 'domready', function() {
      //   console.log("hey")
      //   $("body").on("click", ".infoBox", function(){
      //   console.log("hey there")
      //     $("a[data-listing-id='" + value.id + "']")[0].click();   
      //   })
      // });


    }); //end markers loop

      //********************
      //Multi-stacked Info Windows

      //used to determine whether to zoom in on cluster
      var matchId;
      var IdStatus;

      //add click event to multi-listed infowindows
      google.maps.event.addListener(window.markerCluster, 'clusterclick', function(cluster) {

        //close all windows first
        closeSingleInfoWindow(window.markers);
        closeMultiInfoWindow(window.multiStackedInfoBoxes);

        //clicking on a single marker registers as that, but clicking on a cluster icon triggers the map click
        //event which closes all info windows. This variable indicates that a cluster is being clicked on thus only
        //close single pin info windows
        stackedInfoClicked = 1;

        clusterMarkers = cluster.getMarkers();

        //for multi stacked info windows, set content variable and clear inner and height variables before running
        var multiContent;
        innerContent = "";
        infoWindowHeight = 0;

        //When using ONLY clusters, not a combo of clusters & single pins: if cluster is greater than 1 listing...
        //...meaning its a multi marker and not a single - then open the multi stacked info window, otherwise open the single
        if(cluster.markers_.length > 1){

          //iteriate through all clusters and set the info windows
          $.each(clusterMarkers, function( index, stackedValue) {

            //for the first cluster set the ID
            if(index == 0){
              matchId = stackedValue.property_id;           
            //if id matches each loop result, return true
            }else if(matchId == stackedValue.property_id){
              IdStatus = true;
            //else return false
            }else{
              IdStatus = false;
            }

            //if false - this is a grouped cluster, if true this is a cluster of apt's in the same building
            if(IdStatus == false){
              //current zoom level
              var currentZoomLevel = map.getZoom();
              //set timeout - zoom map
              setTimeout(function(){
                map.panTo(cluster.getCenter()); 
                map.setZoom(currentZoomLevel+2)
              }, 500);

            }else{

              //feed the content to its function, which formats it
              multiContent = createInfoWindowContent(stackedValue, "multi");

            }


          }); //end each

          //after content has been formatted, create the info window. This marker is clicked on thus doesn't 
          //need to be looped through like the single markers, so pass "null" for which marker it is
          //ADDED: if status is true, meaning this is not a cluster but a building w/multiple units, open infoWindow
          if(IdStatus == true){
            createInfoWindow(null, multiContent, "multi", cluster)
          }

        }else{

          //send single cluster info to infoWindow
          var singleContent = createInfoWindowContent(clusterMarkers[0], "single")
          createInfoWindow(clusterMarkers[0], singleContent, "single", cluster);          

        }; //end if/else

        //run resize function on click
        setTimeout(function(){
          $('.resize img').centerImage().fadeIn(200);
        },100)


      }); //end cluster click event

    } //end pushMarkers function     


    //call intial function to drop pins. Uses formated listings object from listings_controller
    var pullListings = $(".listings-wrapper").data("listings");
    window.globalPushMarkers(pullListings);

    //********************
    //Map click event

    // close all info windows when the map is clicked
    google.maps.event.addListener(map, 'click', function() {
    
      closeSingleInfoWindow(window.markers);
      closeMultiInfoWindow(window.multiStackedInfoBoxes);
        
    });

    //********************
    //Close Info Windows

    //close single info windows
    function closeSingleInfoWindow(passInfo){
      //loop through all single markers and close windows
      $.each(passInfo, function(index, value){
        value.info.close();
      });      
    }

    //close multi-info windows
    function closeMultiInfoWindow(passInfo){
      //if cluster is clicked (which triggers map thus closes all windows) 
      //do nothing and set clicked variable to 1 indicating that an info
      //window is now open, else, close all multi-info windows
      if(stackedInfoClicked == 1){
        stackedInfoClicked = 0;
      }else{
        $.each(passInfo, function(index, value){
          value.close();
        });      
      }
    }

    //********************
    //Map Idle

    // listener for changing bounds and zoom level
    google.maps.event.addListener(map, 'idle', function(ev){

      //close info windows on map change
      // closeSingleInfoWindow(window.markers);
      // closeMultiInfoWindow(window.multiStackedInfoBoxes);

      //set up bounds to be passed to listings_controller for query
      var bounds = map.getBounds();
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      var zoom = map.getZoom();
      var center = map.getCenter();

      var center_string = center.toString();

      center_array = []
      center_string.split(',').map(function(str){
        str = str.replace()
        str = str.replace("(" , "");
        str = str.replace(")" , "");
        str = str.replace(" " , "");
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

      //add coordinates to hidden fields
      $("#filters_sw_lat").val(swArray[0])
      $("#filters_sw_lon").val(swArray[1])
      $("#filters_ne_lat").val(neArray[0])
      $("#filters_ne_lon").val(neArray[1])

      //adjust the coordinates in the url on idle
      var stateObj = { foo: "bar" };
      history.pushState(stateObj, "title", "?city="+location+"&zoom="+zoom+"&center_lat="+center_array[0]+"&center_lon="+center_array[1]+"&sw_lat="+swArray[0]+"&sw_lon="+swArray[1]+"&ne_lat="+neArray[0]+"&ne_lon="+neArray[1]);

      //when map is adjusted, refresh the listings and the pins according to the new coordinates
      $.ajax({
        type: 'post',
        url: '/listings/refresh',
        proccessData: false,
        data: {sw_lat: swArray[0], sw_lon: swArray[1], ne_lat: neArray[0], ne_lon: neArray[1]},
        dataType: 'script',
        success:function(data) { }
      });

    }); //end idle event


    //********************
    //Info Windows

    //create the content for the info window depending on which type it is
    function createInfoWindowContent(markerInfo, type){

      if (type == "single"){ 

      infoWindowHeight = 204;

      function imageCarousel(marker){
        html = '<div class="img-container resize"><img src="/assets/apt/'+marker+'"/></div>'
        // var html = "";
        // $(marker).each(function(index,value){
        //   html += '<div class="img-container resize"><img src="/assets/apt/'+value.marker+'"/></div>'
        // })
        return html;
      }


      innerContent = 
        '<div class="listings-img-wrapper infowindow open-modal" onclick="open_modal('+markerInfo.id+')">'+
          '<button class="listings-arrows left-arrow" onclick="carousel_left(this);event.stopPropagation();"><icon class="icon-left-open"></icon></button>'+
          '<button class="listings-arrows right-arrow" onclick="carousel_right(this);event.stopPropagation();"><icon class="icon-right-open"></icon></button>'+
          '<div class="listings-overlay">'+
            '<icon class="icon-map-pin-streamline"></icon> Madrid'+
          '</div>'+
          '<div class="listings-price">'+
            '<p>' + toCurrency((markerInfo.price != undefined ? markerInfo.price : 0), "$") + '</p>'+
          '</div>'+
          '<div class="listings-img-container">'+
            '<div class="listings-slide-container">'+
              imageCarousel(markerInfo.images)+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="address" onclick="onclick="open_modal('+markerInfo.id+')">'+
          '<p>'+
            markerInfo.address + ', Unit ' + markerInfo.unit +
          '</p>'+
        '</div>'+
        '<div class="bed-bath" onclick="onclick="open_modal('+markerInfo.id+')">'+
          '<p>'+
            markerInfo.bed +
            '<span> Bed</span>'+
            ' / '+
            markerInfo.bath +
            '<span> Bath</span>'+
          '</p>'+
        '</div>';

        return innerContent;

      }else if(type == "multi"){

        if (infoWindowHeight <= 100){
          infoWindowHeight += 50;
        }

        innerContent += '<div class="multi-container open-modal" onclick="window.open(\'listings/'+markerInfo.id+'\')">' +
          '<div class="multi-img resize">'+
          '<img src="'+ markerInfo.images +'" style="display: none"/>' +
          '</div>'+
          '<div class="multi-content">' +
          '<p class="address">' + markerInfo.address + ', Unit ' + markerInfo.unit + '</p>' +
          '<p class="bed-bath"><span>' + toCurrency((markerInfo.price != undefined ? markerInfo.price : 0), "$")+ '/Mo.</span> / '+ markerInfo.beds + ' Bed / ' + markerInfo.baths + ' Bath </p>' +
          '</div>' +
          '</div><div class="clear"></div>';

        return innerContent;
      } //end if/else

    } //end createInfoWindowContent

    //after the content is formatted, create the info window
    function createInfoWindow(markerInfo, innerContent, type, cluster){

      var contentString = 
      '<div class="map-listing-box map-listing-box-list" style="overflow: auto; height: '+infoWindowHeight+'px;">' +
        innerContent +
      '</div>';

      //styles for info box, uses google's infobox.js
      var infoBoxOptions = {
          content: contentString,
          disableAutoPan: true,
          maxWidth: 0,
          pixelOffset: new google.maps.Size(-142, -260),
          zIndex: null,
          boxStyle: { 
            position: "relative",  
            opacity: 1,
            width: 285,
            height: - (infoWindowHeight + 30)
          },
          closeBoxMargin: "10px 2px 2px 2px",
          closeBoxURL: "",
          infoBoxClearance: new google.maps.Size(1, 1),
          isHidden: false,
          pane: "floatPane",
          enableEventPropagation: false
        };

      //set info box for each marker depending on which type
      if(type == "single"){

        //if working with only clusters else single icons - need this for loading the map
        if(cluster != undefined){

          //set info box and push into array for single cluster
          var multiStacked = new InfoBox(infoBoxOptions);
          multiStacked.setPosition(cluster.getCenter());

          window.multiStackedInfoBoxes.push(multiStacked); 
          multiStacked.open(map);

          //trigger carousel
          setTimeout(function(){
            window.imgSlider();
          },100)

        }else{
          markerInfo.info = new InfoBox(infoBoxOptions);
        }

      }else if(type == "multi"){
        //set info box and push into array for multi cluster
        var multiStacked = new InfoBox(infoBoxOptions);
        multiStacked.setPosition(cluster.getCenter());

        window.multiStackedInfoBoxes.push(multiStacked); 
        multiStacked.open(map);

      }

    } // end createInfoWindow

    //********************
    //Custom zoom controls

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

    }; // end function -> HomeControl

    function toCurrency(n, currency) {
      return currency + n.toFixed(0).replace(/./g, function(c, i, a) {
          return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
      });
    }// end function -> toCurrency

  }; //end if -> #listings-map

} //end INITALIZE

google.maps.event.addDomListener(window, "load", initialize);
