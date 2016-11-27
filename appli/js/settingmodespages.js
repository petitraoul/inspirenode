/**
 * 
 */

var urlpostmodes='index.php?action=setmodes'

$(document).on('pagecreate', "#settingModes", function() {
	EntetePageTaille("#settingModes");
	//$('#titreprog').html(progmodeclicked_nom + ' - ' +progtagclicked_nom);
	//EntetePageTaille("#progpage");
	refreshlistmode();
});
$(document).on('pageshow', "#settingModes", function() {
	$("#settingModes").trigger('pagecreate');
});

$(document).on('pagehide', "#settingModes", function() {
	sendmodestoserver();
});


function sendmodestoserver(){
	
	/*test={};
	test.tutu="coucou";
	test.toto={};
	test.toto.ti=new Array();
	test.toto.ti.push(10);*/
	mode={};
	mode.modes=modes;
	getJsonObject(function(response) {
		//alert('retour du server');
	},serviceURL + urlpostmodes, mode );
	
	//alert('envoi de la programmation au server');
}