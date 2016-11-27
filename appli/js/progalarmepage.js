/**
 * 
 */

$(document).on('pagecreate', "#progpagealarme", function() {
	EntetePageTaille("#progpagealarme");
	$('#titreprogalarme').html(progcategclicked_nom + ' - ' +progmodeclicked_nom);
	EntetePageTaille("#progpagealarme");
	refreshlistalarme();
});
$(document).on('pageshow', "#progpagealarme", function() {
	$("#progpagealarme").trigger('pagecreate');
});


