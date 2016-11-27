

$(document).on("pagecreate","#Vacancier_Enquete_Page",function(){ // When entering pagetwo
	
	getJsonObject(afficheQuestionnaire,'index.php?action=getquestion&v='+version);
	


});

function afficheQuestionnaire(data){
	var html="";
	for (q in data){
		var codequestion='question_'+data[q].id;
		var qfr={},qen={},qit={},qes={},qde={};
		qfr[codequestion]=data[q]['question_fr'];
		qen[codequestion]=data[q]['question_en'];
		qit[codequestion]=data[q]['question_it'];
		qes[codequestion]=data[q]['question_es'];
		qde[codequestion]=data[q]['question_de'];
		
		$.i18n().load({fr:qfr,
				en:qen,
				it:qit,
				es:qes,
				de:qde}
				)
		html+='<b data-i18n="'+codequestion+'"></b>';
		html+='<div class="basic" data-average="'+data[q].note+'" data-id="'+data[q].id+'"></div></br>';
	}

	$('#Vacancier_Enquete_Page').find('#content').append($(html));
	$('#Vacancier_Enquete_Page').trigger('create');
	$(".basic").jRating({
        step:true,
        length : 10, // nb of stars
        bigStarsPath : imagesURL+"lib_jquery/rating/icons/stars.png",//'../lib_jquery/rating/icons/stars.png',
        smallStarsPath : imagesURL+"lib_jquery/rating/icons/small.png",//'../lib_jquery/rating/icons/small.png',
        showRateInfo : false,
        type : 'big',
        sendRequest : false,
        canRateAgain : true,
        rateMax : 10,
        nbRates : 99,
        onClick : function(element,rate){
        	getJsonObject(function(){},'index.php?action=setreponse&question='+$(element).attr('data-id')+'&rate='+rate+'&v='+version);
        }
      });
}