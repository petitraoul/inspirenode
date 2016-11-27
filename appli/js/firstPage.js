/**
 * 
 */

$(document).on("pagecreate","#firstPage",function(){ // When entering pagetwo
	//alert('lastlogin: ' + getInfoMemo('lastlogin',"z"));
	//alert('lastpassword: ' + getInfoMemo('lastpassword',"z"));
	//
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	
	if ( app ) {
	    // PhoneGap application
		chargeLogin();
	} else {
	    // Web page
	    chargeAcceuil();
	} 
	//navigator.splashscreen.hide();
});






