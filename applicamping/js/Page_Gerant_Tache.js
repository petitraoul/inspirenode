$(document).on("pageshow","#Gerant_Tache_Page",function(){ // When entering pagetwo
	
});
$(document).on("pagecreate","#Gerant_Tache_Page",function(){ // When entering pagetwo
	getJsonObject(get_info_taches,'index.php?action=listtaches&v='+version);
	/*
*/
			


	
});


function get_info_taches(data){
	$( "#Gerant_Tache_Page").find( "#taches li" ).remove();
	//$( "#Gerant_Tache_Page").find( " .connectedSortable" ).listview('refresh');
	
	var htmlpersonnels="";
	var htmltaches="";
	

	//$( "#Gerant_Tache_Page").find( "#taches" ).listview('refresh');

	
	if (data.personnels) {
		for (p in data.personnels) {
			var personnel =data.personnels[p];
			htmlpersonnels+="<h1><u><b>"+personnel.prenom+' '+ personnel.nom+"</b></u></h1>";
			htmlpersonnels+='<div class="sans_scroll" style="margin-left:20px"><ul id="personnel_'+personnel.id+'" id_personnel="'+personnel.id+'" class="connectedSortable" align="left"></ul></div>';
		}
	}
	
	$( "#Gerant_Tache_Page").find("#accordion" ).html(htmlpersonnels);
	
	if (data.taches) {
		for (t in data.taches) {
			var tache =data.taches[t];
			var icon="";
			if (tache.type=='PROBLEME_TECHNIQUE') icon='images/outils.png';
			if (tache.type=='INVENTAIRE') icon='images/room_organizer.png';
			if (tache.type=='MENAGE') icon='images/Balai_icone.png';
			
			var htmlli='<li class="ui-btn" style="font-size: 12px" id_tache="'+tache.id+'"><div class="ui-grid-a">';
			var cotegauche='<div class="ui-block-a" style="font-size: 12px">';
			var cotedroite='<div class="ui-block-b" style="font-size: 12px; text-align:right">';
			
			cotegauche+='<img src="'+imagesURL+''+icon+'" height="40" width="40" style = "float:left; margin-right:10px"/>';
			cotegauche+=tache.type+' ('+tache.id+')</br><div style="color:red">'+tache.commentaire+'</div>';
			var emplacement=findobjinarray(data.emplacements,'id',tache.tag);
			cotedroite+='Emplacement '+emplacement.nom
			var vacancier=findobjinarray(data.vacanciers,'emplacement',tache.tag);
			if (vacancier) cotedroite+='</br>Vacancier '+vacancier.nom + ' ' + vacancier.prenom;
			else cotedroite+='</br>Disponible';
			cotegauche+='';
			
			cotegauche+='</div>';
			cotedroite+='</div>';			
			htmlli+='<div class="ui-grid-a">'+cotegauche+cotedroite+'</div></li>';

			if (findobjinarray(data.personnels,'id',tache.personnel)) {
				$( "#Gerant_Tache_Page").find("#accordion" ).find('#personnel_'+tache.personnel).append(htmlli);
			} else {
				htmltaches+=htmlli;	
			}
		}
	}
	$( "#Gerant_Tache_Page").find( "#taches" ).append($(htmltaches));
	
	var sortevent = function (event,ui){
		console.log('Sort');
		console.log('Changement de tri dans personnel ' +ui.item.parent().attr('id_personnel'));
		var listorder=[];
		var index =0;
		var enfs=ui.item.parent().find(' li');
		for (var c = 0; c < enfs.length; c++) {
			try {
				var child=enfs[c];
				if ((typeof child != "function") && child && child!=0 && $(child).attr('id_tache')){
					listorder.push({id_tache:$(child).attr('id_tache'),id_personnel:ui.item.parent().attr('id_personnel'),rang:index})
					index++;
				}				
			} catch (e) {
				// TODO: handle exception
			}
		}
		getJsonObject(function(){},'index.php?action=tritaches&v='+version,listorder);
	}
	var receiveevent = function (event,ui){
		console.log('Receive');
		console.log('Tache '+ui.item.attr('id_tache') + ' recu par '+$(event.toElement).attr('id_personnel'));
		getJsonObject(function(){},'index.php?action=affecttaches&t='+ui.item.attr('id_tache')+'&p='+$(event.toElement).attr('id_personnel')+'&v='+version);
	}

	
	try {
		$( "#Gerant_Tache_Page").find("#accordion" ).accordion({
		      heightStyle: "content",
		 	 active: false,
			    collapsible: true  
		    });
	} catch (e) {}		
		
	try {
		$( "#Gerant_Tache_Page").find( " .connectedSortable" ).sortable({
		        connectWith: ".connectedSortable",
		        update: sortevent,
		        receive :receiveevent
		      }).disableSelection();		
	} catch (e) {}
}