var emplacement_clicked_personnel=null;

$(document).on("pagecreate","#Personnel_Emplacement_Page",function(){ // When entering pagetwo
	runboucleEtat();
	
	});
$(document).on("pageshow","#Personnel_Emplacement_Page",function(){ // When entering pagetwo
	displayPeriphInLists('#Personnel_Emplacement_Page','#PersoPeriphList1','#PersoPeriphList2','#PersoPeriphList3','#PersoPeriphManuel',null,emplacement_clicked_personnel,'a');
	
	});

function chargeEmplacementPage(tag_uuid) {
	   
	    emplacement_clicked_personnel=tag_uuid;
	   
	    $.mobile.changePage( $("#Personnel_Emplacement_Page"), { transition: "slide"});
	    document.location.hash = "#Personnel_Emplacement_Page";
};