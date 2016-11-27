var tagmodes;
var urltagcateglist='index.php?action=allcategmode';
//var urltagcategdetail='periphbytag.html?taguuid='//'index.php?action=getlistperiphoftag&uuidtag=';


$(document).on("swiperight","#proglistcategpage",function(){ // When entering pagetwo
	parent.history.back();
});
$(document).on("pagecreate","#proglistcategpage",function(){ // When entering pagetwo
	EntetePageTaille("#proglistcategpage");
	$("#proglistcategpage").find('#titre').html(progmodeclicked_nom);
	refreshproglist=false;
	displayWaitprogcateg();
	
});
$(document).on("pageshow","#proglistcategpage",function(){ // When entering pagetwo
	if (refreshproglist) $("#proglistcategpage").trigger('pagecreate');
	
	refreshinfolist();
});

/*$('#tagListPage').bind('eventRefreshTags', function(event) {
	displayWaitTags();
});*/

function displayWaitprogcateg(){
	$('#progListcateg li').remove();
	$('#progListcateg').append('<li data-icon="false"><h4 align="center">Chargement...</h4></li>');
	//$('#TagList2').append('<li data-icon="false"><input onClick="$("#tagListPage").trigger("pagecreate");return false;" id="reload" type="button" data-mini="true" value="Recharger" ></li>'		);
	$('#progListcateg').listview('refresh');
	displayProgCategs(categories);
	//$.getJSON(serviceURL + urltagmodelist, displayProgTags);
};

function displayProgCategs(data) {
	//showAlert("display tag","trace");
	$('#progListcateg li').remove();
	categmodes = data;
	var countplace=0;
	$.each(categmodes, function(index, categ) {
		var icons="";
		icons='<img id="icon" src="'+imagesURL+categ.iconmax+'" height="30" width="30"/>';
		
		htmlligne='<li><a href="#" id="categ_'+categ.id+'" onclick="chargeProgListPage(this,\''+index+'\',\''+categ.nom+'\',\''+progmodeclicked_id+'\',\''+progmodeclicked_nom+'\');return false;">'+
		'<div><p style = "float:left;">'+
			icons+
	    '</p>'+
		'<label><h4 id="nom">'+categ.nom+'</h4>'+
		'<h6 id="etat" style="font-size: 9px"></h6>'+
		'</label></div>'+
		//<h5 id="uuid"></h5>'+
		'</a></li>';
		
		$('#progListcateg').append(htmlligne);
			
	});


	$('#progListcateg').listview('refresh');
	EntetePageTaille("#proglistcategpage");
	$("#proglistcategpage").trigger('create');
	
};








