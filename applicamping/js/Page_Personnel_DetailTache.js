var tache_clicked_personnel=null;


$(document).on("pageshow","#Personnel_DetailTache_Page",function(){ // When entering pagetwo
	get_info_tache(tache_clicked_personnel,data_infos);

	});

function chargeTachePage(tache_id) {
	   
	    tache_clicked_personnel=tache_id;
	   
	    $.mobile.changePage( $("#Personnel_DetailTache_Page"), { transition: "slide"});
	    document.location.hash = "#Personnel_DetailTache_Page";
};

function get_info_tache(tache_id,data){
	if (data.taches) {
			var tache =findobjinarray(data.taches,'id',tache_id);
			if (tache==null) tache=findobjinarray(data.tacheshisto,'id',tache_id); 
			var icon="";
			if (tache.type=='PROBLEME_TECHNIQUE') icon='images/outils.png';
			if (tache.type=='INVENTAIRE') icon='images/room_organizer.png';
			if (tache.type=='MENAGE') icon='images/Balai_icone.png';
			var emplacement=findobjinarray(data.emplacements,'id',tache.tag);
			var htmlli='';
			var cotegauche='<div class="ui-block-a" style="font-size: 12px">';
			var cotedroite='<div class="ui-block-b" style="font-size: 12px; text-align:left">';
			
			cotegauche+='<img src="'+imagesURL+''+icon+'" height="40" width="40" style = "float:left; margin-right:10px"/>';
			cotegauche+=tache.type+' ('+tache.id+')</br><div style="color:red">'+tache.commentaire+'</div>';
			
			cotedroite+='Emplacement '+emplacement.nom
			var vacancier=findobjinarray(data.vacanciers,'emplacement',tache.tag);
			if (vacancier) {
				cotedroite+='</br>'+vacancier.nom + ' ' + vacancier.prenom;
				cotedroite+='</br>Du '+vacancier.premier_jour + ' au ' + vacancier.dernier_jour;
				cotedroite+='</br>Tel '+vacancier.telephone;
			} else cotedroite+='</br>Disponible';
			cotegauche+='';
			
			cotegauche+='</div>';
			cotedroite+='</div>';			
			htmlli+='<div class="ui-grid-a">'+cotegauche+cotedroite+'</div>';

			var comi="",come="";
			if (tache.cominterne!=null) comi=tache.cominterne;
			if (tache.comexterne!=null) come=tache.comexterne;
			htmlli+='<div data-role="fieldcontain">';
			htmlli+='<label for="cominterne">Commentaire interne:</label>';
			htmlli+='<textarea style="color:yellow" cols="40" rows="4" name="cominterne" id="cominterne">'+comi+'</textarea>'
			htmlli+='</div>';
			htmlli+='<div data-role="fieldcontain">';
			htmlli+='<label for="comexterne">Commentaire client:</label>';
			htmlli+='<textarea style="color:red" cols="40" rows="4" name="comexterne" id="comexterne">'+come+'</textarea>'
			htmlli+='</div>';
			
			htmlli+='<div data-role="fieldcontain">';
			htmlli+='<label for="status">Status:</label>';
			htmlli+='<select id="etat"><option value="DECLARE">DECLARE</option><option value="ENCOURS" selected=true>EN COURS</option><option value="CLOS">CLOS</option></select>'
			htmlli+='</div>';
			
			htmlli+='<button onclick="saveTachePerso(\''+tache_id+'\');return false;">Enregistrer</button>'
			$("#Personnel_DetailTache_Page").find("#content").html(htmlli)
			$("#Personnel_DetailTache_Page").trigger('create');
			if ( tache.etat=='DECLARE') tache.etat='ENCOURS';
			$("#Personnel_DetailTache_Page").find("#etat").val(tache.etat).selectmenu('refresh');;
	}
}

function saveTachePerso(tache_id){
	var datatache={};
	datatache.id=tache_id;
	datatache.cominterne=$("#Personnel_DetailTache_Page").find("#cominterne").val();
	datatache.comexterne=$("#Personnel_DetailTache_Page").find("#comexterne").val();
	datatache.etat=$("#Personnel_DetailTache_Page").find("#etat").val();
	getJsonObject(saveCallback,'index.php?action=savetaches_personnel&v='+version,datatache);
	
}

function saveCallback(rep){
	getPageBack();
}