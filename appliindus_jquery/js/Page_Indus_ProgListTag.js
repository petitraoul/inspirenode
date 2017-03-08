var tagmodes;
var tags;
var programmations={};
var progtagclicked_id="";
var progtagclicked_nom="";
var progtag={};
var urltagmodelist='index.php?action=alltagmode&v='+version;
var urltagmodedetail='periphbytag.html?taguuid='//'index.php?action=getlistperiphoftag&uuidtag=';
var urlgetprogrammation='index.php?action=getprogrammation&v='+version;
var urlgetprogrammationalarme='index.php?action=getalarmeprog&mode=';
var urlgetalltagbatiment='index.php?action=alltagbatiment&v='+version;

function chargeProgListPage(element,mode_id,mode_nom) {

	   progmodeclicked_id=mode_id;
	   progmodeclicked_nom=mode_nom;
	   refreshproglist=true;
	   var categ_id='sonde_de_temperature';
	   if (categ_id=='sonde_de_temperature') {
		  $.getJSON(serviceURL + urlgetprogrammation, chargeprogrammation);  
	   } else if (categ_id=='alarme'){
		   $.getJSON(serviceURL + urlgetprogrammationalarme+mode_id, chargealarme);  
	   }
	  
	   //$("#periphpage").trigger('pagecreate');

};	
function chargeprogrammation(progs){
	programmations=progs;
    $.mobile.changePage( $("#Indus_ProgListTag_Page"), { transition: "slide"});
    document.location.hash = "#Indus_ProgListTag_Page";
}


function chargeProgPage(tag,tag_id,tag_nom) {
	   
	   progtagclicked_id=tag_id;
	   progtagclicked_nom=tag_nom;
	   
	   $.getJSON(serviceURL + urlgetalltagbatiment, function(data){
		   progtag=findobjinarray(data.tags,'id',tag_id);
		   
		   
		   if (progtag && progtag.typeprog== "Reservation") {
			    $.mobile.changePage( $("#Indus_ProgReservation_Page"), { transition: "slide"});
			    document.location.hash = "#Indus_ProgReservation_Page";
		   } else {
			    $.mobile.changePage( $("#Indus_ProgChauffage_Page"), { transition: "slide"});
			    document.location.hash = "#Indus_ProgChauffage_Page";
		   }		   
	   }); 
};
	
$(document).on("pagecreate","#Indus_ProgListTag_Page",function(){ // When entering pagetwo
	EntetePageTaille("#proglistpage");
	
	$("#Indus_ProgListTag_Page").find('#titre').html(progmodeclicked_nom);
	refreshproglist=false;
	displayWaitprog();
	
});
$(document).on("pageshow","#Indus_ProgListTag_Page",function(){ // When entering pagetwo
	if (refreshproglist) $("#Indus_ProgListTag_Page").trigger('pagecreate');
	
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
	htmlligne='';
	if (tags[tag.id] && tags[tag.id].type=='Batiment') {
		htmlligne+='<li data-role="list-divider" class="ui-btn">'+
			'<div><p style = "float:left;">'+
			icons+
		    '</p>'+
			'<label><h4 id="nom">'+tag.nom+'</h4>'+
			'<h6 id="etat" style="font-size: 9px"></h6>'+
			'</label></div>'+
			//<h5 id="uuid"></h5>'+
			'</li>';
	} else {
		htmlligne+='<li><a href="#" id="tag_'+tag.id+'" onclick="chargeProgPage(this,\''+tag.id+'\',\''+tag.nom+'\');return false;">'+
			'<div><p style = "float:left;">'+
				icons+
		    '</p>'+
			'<label><h4 id="nom">'+tag.nom+'</h4>'+
			'<h6 id="etat" style="font-size: 9px"></h6>'+
			'</label></div>'+
			//<h5 id="uuid"></h5>'+
			'</a></li>';		
	}

	
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





