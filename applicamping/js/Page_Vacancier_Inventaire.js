
$(document).on("pagecreate","#Vacancier_Inventaire_Page",function(){ // When entering pagetwo
	
    getJsonObject(get_inventaireliste,'index.php?action=listeinventaire_vacancier&v='+version);
    
});
function get_inventaireliste(data){
	var data_objets=data.liste_inventaire;
	$( "#Vacancier_Inventaire_Page").find( "#listeinventaire li" ).remove();
	
	var htmlobjets="";
	var divider="";
	if (data_objets) {
		for (o in data_objets) {
			var objet =data_objets[o];
			
			var codeobjet='objet_'+objet.id;
			var qfr={},qen={},qit={},qes={},qde={};
			qfr[codeobjet]=objet['nom_objet_fr'];
			qen[codeobjet]=objet['nom_objet_en'];
			qit[codeobjet]=objet['nom_objet_it'];
			qes[codeobjet]=objet['nom_objet_es'];
			qde[codeobjet]=objet['nom_objet_de'];
			
			$.i18n().load({fr:qfr,
					en:qen,
					it:qit,
					es:qes,
					de:qde}
					);
			
			if (divider!=objet.zone_objet) {
				divider=objet.zone_objet;
				htmlobjets+='<li data-role="list-divider"><u><b>'+objet.zone_objet+'</b></u></li>';
			}
			/**/
	    
			var htmlli='<li data-icon="false" style="margin-left:5%;padding-top:0px;padding-bottom:0px;padding-left:0px;font-size: 12px" id_objets="li'+objet.id+'" >';
			/*htmlli += '<a href="#"><input type="checkbox" id="check_'+objet.id+'"></a>';
			htmlli += '<a href="#"><div >'+objet.nom_objet_fr+'</div></a>';
			htmlli += '<a href="#"><input type="text" style="text-align:right" id="qte_'+objet.id+'" value="'+objet.quantite_objet+'"></a>'
			*/
			//htmlli+=  '<div data-role="fieldcontain" data-mini="true"><input data-iconpos="right" name="checkbox-h-6a" id="checkbox-h-6a" type="checkbox"><label for="checkbox-h-6a">One</label> </input> </div>'; 
			//htmlli+=   '<a href="#" data-icon="none" > This is a link though </a>';
			htmlli+='<a href="#" style="padding-top:0;padding-bottom:0" onclick="inventaire_coche(\''+objet.id+'\');return true;"> '+
					'	<input data-iconpos="right" name="'+objet.id+'" id="'+objet.id+'" type="checkbox">'+
					'	<label for="'+objet.id+'" id="l'+objet.id+'" data-i18n="'+codeobjet+'"></label> </input>'+
					'   <span class="ui-li-count">'+objet.quantite_objet+'</span></a>';
			htmlli+='<a href="#" onclick="inventaire_probleme(\''+objet.id+'\',\''+objet.quantite_objet+'\');return true;"></a>';
			htmlli+='</li>';

			htmlobjets+=htmlli;	
			
		}
	}
	
	$("#Vacancier_Inventaire_Page").find( "#listeinventaire" ).append($(htmlobjets));
	$("#Vacancier_Inventaire_Page").find("#listeinventaire").listview('refresh');
	$("#Vacancier_Inventaire_Page").trigger('create');
}
function inventaire_probleme(objet_id,qte){
	var libelle = $("#l"+objet_id).html();
	var comment=$("#Vacancier_Inventaire_Page").find("#commentaire").val();
	if (comment!=""){
		comment+="\n";
	} else {
		//comment+=$.i18n( "Anomalies_inventaire" )+":\n";
	}
	comment+=libelle+" ("+qte+")";
	alert($.i18n( "Anomalies_inventaire" )  + " + " + libelle);
	$("#Vacancier_Inventaire_Page").find("#commentaire").val(comment);
	$("#Vacancier_Inventaire_Page").find("#commentaire").textinput( "refresh" );

}
function inventaire_coche(objet_id){
	//$("#Vacancier_Inventaire_Page").find("#"+objet_id).attr("checked",true).checkboxradio("refresh");
}

function saveInventaireVacancier(){
	var datatache={};
	
	datatache.commentaire=$("#Vacancier_Inventaire_Page").find("#commentaire").val();
	datatache.type='INVENTAIRE';
	getJsonObject(saveCallbackInventaire,'index.php?action=savetaches_vacancier&v='+version,datatache);
	
}

function saveCallbackInventaire(rep){
	getPageBack();
}