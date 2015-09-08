// $(document).ready(function(){

// 	if($('#angel_list_scraper_location_status').attr('location_id').length > 0){
		
// 		function progress(percent, $element) {
// 		    var progressBarWidth = percent * $element.width();
// 		    $element.find('div').animate({ width: progressBarWidth }, 500).html(parseInt(percent) + "%&nbsp;");
// 		}
		
// 		var location_id = $('#angel_list_scraper_location_status').attr('location_id');
		
		
// 		doPoll(location_id);
// 	}

// 	function doPoll(location){
		
// 	    $.get('/admin/angel_list_scraper_status/'+location, function(data) {
						
// 	        var completion_percentage = data.last_angel_list_page_processed/data.total_angel_list_pages;
// 			progress(completion_percentage, $('#progress_bar'));
		
// 	        setTimeout(doPoll(location),5000);
// 	    });
// 	}
	
	
// });