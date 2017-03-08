var tag_clicked_indus=null;

$(document).on("pagecreate","#Indus_Periph_Page",function(){ // When entering pagetwo
	runboucleEtat();
	
	});
$(document).on("pageshow","#Indus_Periph_Page",function(){ // When entering pagetwo
	displayPeriphInLists('#Indus_Periph_Page','#IndusPeriphList1','#IndusPeriphList2','#IndusPeriphList3','#IndusPeriphManuel',null,tag_clicked_indus,'a');
	
	});

function chargeIndusPeriphPage(element,tag_uuid) {
	   
	    tag_clicked_indus=tag_uuid;
	   
	    $.mobile.changePage( $("#Indus_Periph_Page"), { transition: "slide"});
	    document.location.hash = "#Indus_Periph_Page";
};