//var tagmodes;
var urlmodelist='index.php?action=allmodes';
var urlpostprogrammation='index.php?action=setprogrammation'
//var urltagmodedetail='periphbytag.html?taguuid='//'index.php?action=getlistperiphoftag&uuidtag=';


$(document).on("swiperight","#progmodepage",function(){ // When entering pagetwo
	parent.history.back();
});

$(document).on("pagecreate","#progmodepage",function(){ // When entering pagetwo
	//refreshtag=false;
	modeschanged=false;
	displayWaitprogmode();
	
});
$(document).on("pageshow","#progmodepage",function(){ // When entering pagetwo
	if (programmantionchanged) {
		setTimeout(sendprogrammationtoserver(),5);
	}
	if (modeschanged){
		setTimeout(function () {$("#progmodepage").trigger('pagecreate');},1000);
	}
	
});

function sendprogrammationtoserver(){
	programmantionchanged=false;
	getJsonObject(function(response) {
		//alert('retour du server');
	},serviceURL + urlpostprogrammation, programmations );
	//alert('envoi de la programmation au server');
}

/*$('#tagListPage').bind('eventRefreshTags', function(event) {
	displayWaitTags();
});*/

function displayWaitprogmode(){
	$('#progListmode li').remove();
	$('#progListmode').append('<li data-icon="false"><h4 align="center">Chargement...</h4></li>');
	//$('#TagList2').append('<li data-icon="false"><input onClick="$("#tagListPage").trigger("pagecreate");return false;" id="reload" type="button" data-mini="true" value="Recharger" ></li>'		);
	$('#progListmode').listview('refresh');
	getJsonObject(displayProgmodes,urlmodelist);
};



function displayProgmodes(data) {
	//showAlert("display tag","trace");
	$('#progListmode li').remove();
	lmodes = data.modes;
	var countplace=0;
	$.each(lmodes, function(index, mode) {
		htmlligne='<li><a href="#" id="mode_'+index+'" onclick="chargeProgCategListPage(this,\''+index+'\',\''+mode.nom+'\');return false;">'+
		
		//htmlligne='<li><a href="#" id="mode_'+index+'" onclick="chargeProgListPage(this,\''+index+'\',\''+mode.nom+'\');return false;">'+
		'<div><p style = "float:left;">'+
			'<img id="icon" src="'+imagesURL+mode.icon+'" height="30" width="30"/>'+
	    '</p>'+
		'<label><h4 id="nom">'+mode.nom+'</h4>'+
		'<h6 id="etat" style="font-size: 9px"></h6>'+
		'</label></div>'+
		'</a></li>';
		$('#progListmode').append(htmlligne);
		
		$("#mode_"+index).on( "taphold", function( event ) {
			$("#modepopuplist li").remove();
			$("#modepopuplist").append('<li data-role="divider" data-theme="b">Programmation</li>');
			$("#modepopuplist").append('<li><a href="#" onclick="copierprog(\''+index+'\');$( \'#modepopupMenu\' ).popup( \'close\');">Copier la prog</a></li>');
			$("#modepopuplist").append('<li><a href="#" onclick="collerprog(\''+index+'\');$( \'#modepopupMenu\' ).popup( \'close\');">Coller la prog</a></li>');
			$("#modepopuplist").append('<li><a href="#" onclick="effacerprog(\''+index+'\');$( \'#modepopupMenu\' ).popup( \'close\');">Effacer la prog</a></li>');
			
			$("#modepopuplist").append('<li data-role="divider">Modes</li>');
			//$.each(modes, function(index, mode) {
			$("#modepopuplist").append('<li><a href="#" onclick="changeEtatMode(\''+mode.nom+'\');$( \'#modepopupMenu\' ).popup( \'close\');">Activer le mode '+mode.nom+'</a></li>');
			$("#modepopuplist").append('<li><a href="#" onclick="$( \'#modepopupMenu\' ).popup( \'close\');popupdiffererEtatMode(\''+index+'\');">Differer le mode '+mode.nom+'</a></li>');

			//});
				
		
			$( "#modepopupMenu" ).popup( "close");
			$("#modepopuplist").listview('refresh');
			$( "#modepopupMenu" ).popup( "open" ,{ shadow: false ,positionTo : "window"} );
		} )
		if (data.diff!=null && data.diff.id==index){
			$('#mode_'+index).find("#etat").html('Activation différée à '+data.diff.heure+' le '+data.diff.date);	
		}
		
	});

	
	$('#progListmode').listview('refresh');
	EntetePageTaille("#progmodepage");
	$("#progmodepage").trigger('create');
};











