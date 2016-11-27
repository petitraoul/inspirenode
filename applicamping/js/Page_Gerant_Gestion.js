

$(document).on("pagecreate","#Gerant_Gestion_Page",function(){ // When entering pagetwo
	
	var servicesVacancier=[ {texte:"Vacanciers",icon:"images/user.jpg",
								page:"Page_vacancier",container:"containerDG"},
							{texte:"Questions",icon:"images/favoris_icone_enable.png",
								page:"Page_question",container:"containerGG"},
							{texte:"Personnel",icon:"images/room_child.png",
								page:"Page_personnel",container:"containerGG"},
							{texte:"Liste inventaire",icon:"images/room_dining.png",
								page:"Page_personnel",container:"containerDG"},
							{texte:"Objets liste inventaire",icon:"images/room_dining.png",
								page:"Page_personnel",container:"containerDG"}] ;
	

    $('#Gerant_Gestion_Page').find('#containerGG li').remove();
    $('#Gerant_Gestion_Page').find('#containerDG li').remove();
    for (s in servicesVacancier){
		var html='<li data-icon="false"><a href="#'+servicesVacancier[s].page+'">';
	    html+= '		<p style="text-align:center">';
	    html+= '			<img src="'+imagesURL+''+servicesVacancier[s].icon+'" align="middle" height="40" width="40"/>';
	    html+= '		</p>';
	    html+= '		<h4 align="center">'+servicesVacancier[s].texte+'</h4>';
	    html+= '</a>';
	    html+= '</li>';
	    
	
	    $('#Gerant_Gestion_Page').find('#'+servicesVacancier[s].container+'').append(html);		
    	
	}

    
    $('#Gerant_Gestion_Page').find('#containerGG').listview('refresh');
    $('#Gerant_Gestion_Page').find('#containerDG').listview('refresh');
    
    $('#Gerant_Gestion_Page').trigger('create');
    
});

