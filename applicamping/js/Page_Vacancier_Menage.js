
$(document).on("pagecreate","#Vacancier_Menage_Page",function(){ // When entering pagetwo
	
	
	});
$(document).on("pageshow","#Vacancier_Menage_Page",function(){ // When entering pagetwo
	
	/*try {
		$("#Vacancier_Menage_Page").find("#date").datepicker({
			showButtonPanel: false
		});
		$("#Vacancier_Menage_Page").find("#heure").timepicker({
			'scrollDefault': 'now',
			'disableTimeRanges': [
	                          ['0am', '8am'],
	                          ['7pm', '11:59pm']
	                      ]
	                  });
		$("#Vacancier_Menage_Page").trigger('create');
	} catch (e) {
		// TODO: handle exception
	}*/

});


function saveMenageVacancier(){
	var datatache={};
	datatache.commentaire=$("#Vacancier_Menage_Page").find("#commentaire").val();
	datatache.date=$("#Vacancier_Menage_Page").find("#date").val();
	datatache.heure=$("#Vacancier_Menage_Page").find("#heure").val();
	
	datatache.type='MENAGE';
	if (datatache.date && datatache.heure) getJsonObject(saveCallbackMenage,'index.php?action=savetaches_vacancier&v='+version,datatache);
}

function saveCallbackMenage(rep){
	getPageBack();
}
