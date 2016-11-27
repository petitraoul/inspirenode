/**
 * 
 */

$(document).on('pagecreate', "#progpage", function() {
	EntetePageTaille("#progpage");
	$('#titreprog').html(progmodeclicked_nom + ' - ' +progtagclicked_nom);
	EntetePageTaille("#progpage");
	refreshlistprogrammation();

});
$(document).on('pageshow', "#progpage", function() {
	$("#progpage").trigger('pagecreate');
});


$(document).on('pagecreate', "#progpage2", function() {
	EntetePageTaille("#progpage");
	$('#titreprog2').html(progmodeclicked_nom + ' - ' +progtagclicked_nom);
	EntetePageTaille("#progpage");
	refreshlistprogrammation2();
	 
});
$(document).on('pageshow', "#progpage2", function() {
	$("#progpage2").trigger('pagecreate');
});

