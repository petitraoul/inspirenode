/**
 * 
 */

$(document).on('pagecreate', "#Indus_ProgChauffage_Page", function() {
	EntetePageTaille("#Indus_ProgChauffage_Page");
	$('#titreprog').html(progmodeclicked_nom + ' - ' +progtagclicked_nom);
	EntetePageTaille("#Indus_ProgChauffage_Page");
	refreshlistprogrammation();

});
$(document).on('pageshow', "#Indus_ProgChauffage_Page", function() {
	$("#Indus_ProgChauffage_Page").trigger('pagecreate');
});





function refreshlistprogrammation(){
	$('#programmationlist li').remove();
	$('#programmationlist').append('<li data-role="list-divider">Programmation</li>');
	if (programmations['mode_'+progmodeclicked_id]!=null && programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]!=null){
		   for (indexp in programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]){
			   p=programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][indexp];
			   j=" ";
			   for (indexj in p['jours']){
				   jour=p['jours'][indexj]
				   if (jour==1) j+=' ' + indexj;
			   }

			   texte =  p['heure'] + ' -> ' +   p['valeur'] + ' ('+j+' )';
			   $('#programmationlist').append('<li><a href="#" >'+texte+'</a><a href="#" onclick="deleteprog('+indexp+');return false" data-rel="popup" data-position-to="window" data-transition="pop">delete</a></li>');				   
		   }
	}
	
    $('#programmationlist').append('<li><a href="#" onclick="addprog();return false;">Ajouter</a></li>');
    $('#programmationlist').listview('refresh');
    
}
function addprog(){
	   jours={};
	   if ($('#checkLu').is(":checked")) jours.Lu=1; else jours.Lu=0;
	   if ($('#checkMa').is(":checked")) jours.Ma=1; else jours.Ma=0;
	   if ($('#checkMe').is(":checked")) jours.Me=1; else jours.Me=0;
	   if ($('#checkJe').is(":checked")) jours.Je=1; else jours.Je=0;
	   if ($('#checkVe').is(":checked")) jours.Ve=1; else jours.Ve=0;
	   if ($('#checkSa').is(":checked")) jours.Sa=1; else jours.Sa=0;
	   if ($('#checkDi').is(":checked")) jours.Di=1; else jours.Di=0;
	   
	  /* $.each(jours, function(index, jour) {
		   if (jour==true) alert(index);
	   });*/
	   //alert("� "+$('#progtimer').val());
	   //alert("pour "+$('#progvaleur').val());	
	   
	   p={};
	   p['heure']=$('#progtimer').val();
	   p['valeur']=$('#progvaleur').val();
	   p['jours']=jours;
	   
	   if (programmations['mode_'+progmodeclicked_id]==null) programmations['mode_'+progmodeclicked_id]={};
	   if (programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]==null) programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]={};
	   programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][new Date().getTime()]=p;
	   programmantionchanged=true;
	   refreshlistprogrammation();
}

function deleteprog(id){
	   programmantionchanged=true;
	   delete programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][id];
	   refreshlistprogrammation();
}