$(document).ready(function(){

	// This triggers every time a form element is changed
	$(":input").on('change',function(event) {

		// This submits the form (which is set to remote true in the html)
		$("#form").submit();
		
	});

});