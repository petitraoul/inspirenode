$(document).on('pagecreate', "#Indus_ProgReservation_Page", function() {
	EntetePageTaille("#Indus_ProgReservation_Page");
	$('#titreprog2').html(progmodeclicked_nom + ' - ' +progtagclicked_nom);
	EntetePageTaille("#Indus_ProgReservation_Page");
	refreshlistprogrammation2();
	 
});
$(document).on('pageshow', "#Indus_ProgReservation_Page", function() {
	$("#Indus_ProgReservation_Page").trigger('pagecreate');
});


function refreshlistprogrammation2(){
	$('#programmationlist2 li').remove();
	$('#programmationlist2').append('<li data-role="list-divider">Programmation</li>');
	if (programmations['mode_'+progmodeclicked_id]!=null && programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]!=null){
		   for (indexp in programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]){
			   p=programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][indexp];
			
			   texte =  p['jours'] + ' ' + p['heures'] + ' -> ' + p['joure'] + ' ' + p['heuree'] + '==' + p['valeur'] ;
			   $('#programmationlist2').append('<li><a href="#" >'+texte+'</a><a href="#" onclick="deleteprog2('+indexp+');return false" data-rel="popup" data-position-to="window" data-transition="pop">delete</a></li>');				   
		   }
	}
	
    $('#programmationlist2').append('<li><a href="#" onclick="addprog2();return false;">Ajouter</a></li>');
    $('#programmationlist2').listview('refresh');
    
}

function addprog2(){
	   //jours={};
	   
	  /* $.each(jours, function(index, jour) {
		   if (jour==true) alert(index);
	   });*/
	   //alert("� "+$('#progtimer').val());
	   //alert("pour "+$('#progvaleur').val());	
	   
	   p={};
	   p['jours']=$('#progdate_start').val();
	   p['heures']=$('#progtimer_start').val();
	   p['joure']=$('#progdate_stop').val();
	   p['heuree']=$('#progtimer_stop').val();
	   p['valeur']=$('#progvaleur2').val();

	   
	   if (programmations['mode_'+progmodeclicked_id]==null) programmations['mode_'+progmodeclicked_id]={};
	   if (programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]==null) programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id]={};
	   programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][new Date().getTime()]=p;
	   programmantionchanged=true;
	   refreshlistprogrammation2();
}
function deleteprog2(id){
	   programmantionchanged=true;
	   delete programmations['mode_'+progmodeclicked_id]['tag_'+progtagclicked_id][id];
	   refreshlistprogrammation2();
}