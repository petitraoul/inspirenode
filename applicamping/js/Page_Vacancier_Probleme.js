

function saveProblemeVacancier(tache_id){
	var datatache={};
	datatache.commentaire=$("#Vacancier_Probleme_Page").find("#commentaire").val();
	datatache.type='PROBLEME_TECHNIQUE';
	if (datatache.commentaire) getJsonObject(saveCallbackProbleme,'index.php?action=savetaches_vacancier&v='+version,datatache);
	
}

function saveCallbackProbleme(rep){
	getPageBack();
}