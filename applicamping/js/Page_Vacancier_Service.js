$(document).on("pagecreate","#Vacancier_Service_Page",function(){ // When entering pagetwo
	
	var servicesVacancier=[ {texte:"vacancier_btn_inventaire",icon:"images/room_dining.png",
		page:"Vacancier_Inventaire_Page",container:"containerGS"},
	{texte:"vacancier_btn_probleme_technique",icon:"images/light0.png",
		page:"Vacancier_Probleme_Page",container:"containerDS"},
	{texte:"vacancier_btn_menage",icon:"images/room_child.png",
		page:"Vacancier_Menage_Page",container:"containerGS"}] ;

		$('#Vacancier_Service_Page').find('#containerGS li').remove();
		$('#Vacancier_Service_Page').find('#containerDS li').remove();
		for (s in servicesVacancier){

				var html='<li data-icon="false"';
				html+= '><a href="#'+servicesVacancier[s].page+'" data-transition="slide">';
				html+= '		<p style="text-align:center">';
				html+= '			<img src="'+imagesURL+''+servicesVacancier[s].icon+'" align="middle" height="40" width="40"/>';
				html+= '		</p>';
				html+= '		<h4 align="center" data-i18n="'+servicesVacancier[s].texte+'"></h4>';
				html+= '</a>';
				html+= '</li>';
				

					$('#Vacancier_Service_Page').find('#'+servicesVacancier[s].container+'').append(html);		
					

				
		}
		
		
		$('#Vacancier_Service_Page').find('#containerGS').listview('refresh');
		$('#Vacancier_Service_Page').find('#containerDS').listview('refresh');
});

$(document).on("pageshow","#Vacancier_Service_Page",function(){ // When entering pagetwo
	
    getJsonObject(get_info_taches_vacancier,'index.php?action=listtaches_vacancier&v='+version);
    
});

function get_info_taches_vacancier(data){
	data_infos=data;
	$( "#Vacancier_Service_Page").find( "#taches_vacancier li" ).remove();
	//$( "#Gerant_Tache_Page").find( " .connectedSortable" ).listview('refresh');
	
	var htmlpersonnels="";
	var htmltaches="";
	
	var inventaireRealise=false;
	
	if (data.taches) {
		for (t in data.taches) {
			var tache =data.taches[t];
			var icon="";
			if (tache.type=='PROBLEME_TECHNIQUE') icon='images/outils.png';
			if (tache.type=='INVENTAIRE'){
				icon='images/room_organizer.png';
				inventaireRealise=true;
			}
			if (tache.type=='MENAGE') icon='images/Balai_icone.png';
			var emplacement=findobjinarray(data.emplacements,'id',tache.tag);
			var htmlli='<li data-icon="false" style="font-size: 12px" id_tache="'+tache.id+'" >';
			htmlli+='<a href="#dd" ><img src="'+imagesURL+''+icon+'" height="40" width="40" style = "float:left; margin-right:10px"/>';
			htmlli+=$.i18n( tache.type )+' ('+tache.id+')</br><div style="color:red;font-size: 12px">'+tache.commentaire+'</div><div style="color:yellow;font-size: 12px">'+tache.comexterne+'</div>';
			htmlli+='</br><div">'+$.i18n( tache.etat )+' ('+tache.date_heure+')</div>';
			
			htmlli+='</a>';
			htmlli+='</li>';

			htmltaches+=htmlli;	
			
		}
	}
	
	$("#Vacancier_Service_Page").find( "#taches_vacancier" ).append($(htmltaches));
	$("#Vacancier_Service_Page").find("#taches_vacancier").listview('refresh');
	

	$("#Vacancier_Service_Page").trigger('create');
}