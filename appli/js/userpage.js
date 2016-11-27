$(document).on('pagecreate', "#settingUser", function() {
	EntetePageTaille("#settingUser");
	$("#savebtn").hide();
	$("#addbtn").show();
	
	refreshlistuser();
});
$(document).on('pageshow', "#settingUser", function() {
	$("#settingUser").trigger('pagecreate');
});