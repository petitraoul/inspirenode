var data_infos={};

$(document).on("pageshow","#Personnel_TacheHisto_Page",function(){ // When entering pagetwo
		getJsonObject(get_info_tachesHisto_perso,'index.php?action=listtaches_personnel&v='+version);

});
$(document).on("pagecreate","#Personnel_TacheHisto_Page",function(){ // When entering pagetwo
	/*
*/
});


function get_info_tachesHisto_perso(data){
	data_infos=data;
	
	$( "#Personnel_TacheHisto_Page").find( "#taches_personnel li" ).remove();
	//$( "#Gerant_Tache_Page").find( " .connectedSortable" ).listview('refresh');
	
	var htmlpersonnels="";
	var htmltaches="";
	

	if (data.tacheshisto) {
		for (t in data.tacheshisto) {
			var tache =data.tacheshisto[t];
			var icon="";
			if (tache.type=='PROBLEME_TECHNIQUE') icon='images/outils.png';
			if (tache.type=='INVENTAIRE') icon='images/room_organizer.png';
			if (tache.type=='MENAGE') icon='images/Balai_icone.png';
			var emplacement=findobjinarray(data.emplacements,'id',tache.tag);
			var htmlli='<li style="font-size: 12px" id_tache="'+tache.id+'" data-split-icon="gear" data-split-theme="a"><a href="#" onclick="chargeTachePage(\''+tache.id+'\');return true;">';
			var cotegauche='<div class="ui-block-a" style="font-size: 12px">';
			var cotedroite='<div class="ui-block-b" style="font-size: 12px; text-align:right">';
			
			cotegauche+='<img src="'+imagesURL+''+icon+'" height="40" width="40" style = "float:left; margin-right:10px"/>';
			cotegauche+=tache.type+' ('+tache.id+')</br><div style="color:red">'+tache.commentaire+'</div><div style="color:yellow">'+tache.cominterne+'</div>';
			cotegauche+='</br><div style="float:right">'+tache.etat+' ('+tache.date_heure+')</div>';
			
			cotedroite+='<b>Emplacement '+emplacement.nom+'</b>'
			var vacancier=findobjinarray(data.vacanciers,'emplacement',tache.tag);
			if (vacancier) cotedroite+='</br>'+vacancier.nom + ' ' + vacancier.prenom;
			else cotedroite+='</br>Disponible';
			cotegauche+='';
			
			cotegauche+='</div>';
			cotedroite+='</div>';			
			htmlli+='<div class="ui-grid-a">'+cotegauche+cotedroite+'</div></a><a href="#" onclick="chargeEmplacementPage(\''+emplacement.uuid+'\');return true;"></a></li>';

			htmltaches+=htmlli;	
			
		}
	}
	$("#Personnel_TacheHisto_Page").find( "#taches_personnel" ).append($(htmltaches));
	$("#Personnel_TacheHisto_Page").find("#taches_personnel").listview('refresh');
	$("#Personnel_TacheHisto_Page").trigger('create');


}