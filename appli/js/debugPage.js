

$(document).on("pagecreate","#debugpage",function(){ // When entering pagetwo
		//var urldebuglink='index.php?action=getetat&lastetat=2'; 
	    alert('debug action1');
		var urldebuglink='index.php?action=allconfiglite'; 
		getJsonObject(executeDebugTaskb,urldebuglink);
	});
$(document).on("pageshow","#debugpage",function(){ // When entering pagetwo
	
	$("#debugpage").trigger('pagecreate');
});


function executeDebugTaskb(data) {
	 alert('debug action3');
	$('#debuglabel').html(JSON.stringify(data,null,4));
	$('#debuglabel').trigger('refresh');
	$("#debugpage").trigger('create');
}
function executeDebugTask(data) {
	
	alert('debug action 2');
	var htmldebug="<h2>Get Etats</h2></br>";
	$.each(data, function(index, etat) {
		
		if (etat['expression']!= null) {
			var eta=etat['expression']['etat'];
			var eta2=etat['expression']['etat2'];
			var expr1=etat['expression']['expr1'];
			var expr2=etat['expression']['expr2'];
			var expr3=etat['expression']['expr3'];
			htmldebug+= index + " : " +
											"</br>--etat  =  "+ eta;
			if (eta2!=null) htmldebug+=		"</br>--etat2  =  "+ eta2;
			if (expr1!=null) htmldebug+=	"</br>--expr1  =  "+ expr1;
			if (expr2!=null) htmldebug+=	"</br>--expr2  =  "+ expr2;
			if (expr3!=null) htmldebug+=	"</br>--expr3  =  "+ expr3;
			htmldebug+="</br>----------</br>";
		} if (index=="mode" || index=="md5_etat"){
			htmldebug+= index + " = " + etat +
			"</br>----------</br>";
		}
		
	});	
	$('#debuglabel').html(htmldebug);
	$('#debuglabel').trigger('refresh');
	
	$("#debugpage").trigger('create');
	//$(".ui-slider-input").hide();
   
   };