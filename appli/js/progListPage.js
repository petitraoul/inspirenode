var tagmodes;
var urltagmodelist='index.php?action=alltagmode';
var urltagmodedetail='periphbytag.html?taguuid='//'index.php?action=getlistperiphoftag&uuidtag=';


$(document).on("swiperight","#proglistpage",function(){ // When entering pagetwo
	parent.history.back();
});
$(document).on("pagecreate","#proglistpage",function(){ // When entering pagetwo
	EntetePageTaille("#proglistpage");
	
	$("#proglistpage").find('#titre').html(progmodeclicked_nom);
	refreshproglist=false;
	displayWaitprog();
	
});
$(document).on("pageshow","#proglistpage",function(){ // When entering pagetwo
	if (refreshproglist) $("#proglistpage").trigger('pagecreate');
	
	refreshinfolist();
});

/*$('#tagListPage').bind('eventRefreshTags', function(event) {
	displayWaitTags();
});*/

function displayWaitprog(){
	$('#progListTag li').remove();
	$('#progListTag').append('<li data-icon="false"><h4 align="center">Chargement...</h4></li>');
	//$('#TagList2').append('<li data-icon="false"><input onClick="$("#tagListPage").trigger("pagecreate");return false;" id="reload" type="button" data-mini="true" value="Recharger" ></li>'		);
	$('#progListTag').listview('refresh');
	getJsonObject(displayProgTags,urltagmodelist);
	//$.getJSON(serviceURL + urltagmodelist, displayProgTags);
};

function displayProgTags(data) {
	//showAlert("display tag","trace");
	$('#progListTag li').remove();
	tagmodes = data.tagsmode;
	var countplace=0;
	$.each(tagmodes, function(index, tag) {
		displayrecursiveProgtags(tag,0,"");
			
	});


	$('#progListTag').listview('refresh');
	EntetePageTaille("#proglistpage");
	$("#proglistpage").trigger('create');
	refreshinfolist();
};


function displayrecursiveProgtags(tag,level,icon){
	/*
	 * data-inset="true" data-divider-theme="b" data-split-theme="b" data-split-icon="plus"
	 * <a href="#" data-rel="popup" data-position-to="window" data-transition="pop">Purchase album</a>
	 */
	indentation="";
	for (i = 0; i < level; i++) 
	{ 
		indentation+=" > "; 
	} 
	var icons="";
	icons=icon+'<img id="icon" src="'+imagesURL+tag.icon+'" height="30" width="30"/>';
	
	htmlligne='<li><a href="#" id="tag_'+tag.id+'" onclick="chargeProgPage(this,\''+tag.id+'\',\''+tag.nom+'\');return false;">'+
	'<div><p style = "float:left;">'+
		icons+
    '</p>'+
	'<label><h4 id="nom">'+tag.nom+'</h4>'+
	'<h6 id="etat" style="font-size: 9px"></h6>'+
	'</label></div>'+
	//<h5 id="uuid"></h5>'+
	'</a></li>';
	
	$('#progListTag').append(htmlligne);
	if (tag.enfants!=null /*&& tag.enfants.length>0*/) {
		$.each(tag.enfants, function(index, enf) {
			displayrecursiveProgtags(enf,level+1,icons);
		});
	}

};


function refreshinfolist(){

	if (programmations['mode_'+progmodeclicked_id]!=null ){
		   $.each(programmations['mode_'+progmodeclicked_id], function(indext, t) {
			   
			   texte="";
			   for (indexp in t) {
				p=t[indexp];   
			   
				   j=" ";
				   if (p['heure']) {
					   for (indexj in p['jours']){
						   jour=p['jours'][indexj]
						   if (jour==1) j+=' ' + indexj;
					   }
					   /*$.each(p['jours'], function(indexj, jour) {
						   
					   });*/
					   
					   texte +=  p['heure'] + ' -> ' +   p['valeur'] + ' ('+j+' )</br>';					   
				   } else {
					   texte +=  p['jours'] + ' ' + p['heures'] + ' -> ' + p['joure'] + ' ' + p['heuree'] + '=='  +p['valeur']+'</br>' ;
				   }

			   }
			   $('#'+indext).find("#etat").html(texte);
		   });
		   
	}
}





