/**
 * 
 */
//var typeconnexion="local";
var userlogin="";
var userpassword="";
var refreshacceuil=true;
var lasthash="";
var timerinterval;
var lastetat={};
var lastmd5_etat="0";
var etatbusy=false;
var config={};
var version='home.1.1.1'
var traductionactive=false;
var httprequestTimeoutms=4000
var idactuel='';
var configbytag={};
var peripheriques={};
var modes={};
var modeactuel=null;
var typeactuel=null;
var programmations={};
var categories={};
var tagsenfants={};
var tags = {};
var leveltag=0;
var users={};
var alarmes={};
var alarmesprogrammation={};
var nexthash="",lasthash="";
var historiquepage=[];



function getPage(namePage){
	$.mobile.changePage( $('#'+namePage),{transition:"slide"});
	var numberOfEntries = window.history.length;
	if (document.location.hash=='#loginPage'){
		history.replaceState(null, namePage, '#'+namePage);
	}
}
function getPageBack(){
	//alert('getBack');
	if (history.length>1 && navigator && navigator.app) {
		//alert('navigator.app.backHistory()');
	    navigator.app.backHistory();
	    
	} else if (window.history && typeof window.history.back() == 'function') {
		//alert('window.history.back()');
		window.history.back();
	} else {
		var previous = '#' + config.firstpage;
		if (historiquepage.length>1) {
			previous='#' +historiquepage[1];
			//alert('previous not take firstpage '+previous);
		}
		//alert('previous get '+previous);
		$.mobile.changePage(previous, {
		    transition: 'slide',
		    reverse: true
		});
	}
}


$( window ).hashchange(function() {
    nexthash = location.hash;
    //alert(lasthash + " => " +nexthash);
    if (nexthash=="" && lasthash=="#acceuilPage"){
    	//alert( 'exit appli' );
    	if (isitdevice()) navigator.app.exitApp();
    }
    
    lasthash=nexthash;
});







function connexionappli(){
	userlogin=$('#un').val();
	userpassword=$('#pw').val();
	usersavepw=$('#savepw').is(':checked');
	//alert(usersavepw);
	if (typeof device != "undefined"){
		if (usersavepw==1 || usersavepw=='1') {
				setInfoMemo('lastlogin',userlogin);
				setInfoMemo('lastpassword',userpassword);			
		} else {
				setInfoMemo('lastlogin',userlogin);
				setInfoMemo('lastpassword','');	
		}

	  setInfoMemo('savepw',usersavepw);
	}
	
	initconnexiontype(chargeAcceuil);
}

function chargeAcceuil(){
	//$('#loginPage').load('#acceuilPage');
	
	auth = make_base_auth(userlogin, userpassword);
	//alert( "user "+userlogin+" passwd "+userpassword + " =" +auth);
	$.ajaxSetup({
    	beforeSend: function(xhr,settings) {
    	   // alert('setup '+settings.url);
             xhr.setRequestHeader('Authorization', auth);
         }
	});
	getConfig(function (data){
		if (data.icon_application) {
			configapplication(data);
			$.mobile.changePage( $('#acceuilPage'), { transition: 'slide'});			
		} else {
			$('#btnconnection').html("Erreur identification")
		}

	});
	
}







function configapplication(configdata){
	config=configdata;
	appliquetitreperso();
	
	listename='#accueilmenulist'+config.menubuttoncountshow;
	//$(listename+' li').remove();
	index=1;
	for ( var menuname in config.menubutton) {
		menuproperty=config.menubutton[menuname];
		if (menuproperty.visible) {
			button=$(listename).find('#button'+index);
			button.attr('href',menuproperty.href);
			button.html(menuproperty.name);
			
			//var htmlmenu='<li><a href="'+menuproperty.href+'" id="'+menuproperty.menuname+'" data-transition="slide" '+classes+' data-prefetch="true">'+menuproperty.name+'</a></li>'
			//$(listename).append($(htmlmenu)).trigger('create');;
			/*<li><a href="#acceuilPage" id="accueilbutton" data-transition="slide" class="ui-btn-active ui-state-persist">Accueil</a></li>
			<li><a href="#tagListPage" id="tagbutton" data-transition="slide" data-prefetch="true">Batiments</a></li>
			<li><a href="#progmodepage" id="programmationbutton" data-transition="slide" data-prefetch="true">Programmation</a></li>
			<li><a href="#highchartpage" id="graphiquebutton" data-transition="slide" data-prefetch="true">Graphiques</a></li>
			*/
			//$('#'+menuname).html(menuproperty.name);
			index+=1;
		}  
	}
	//$('#accueilmenulist').grid('refresh');
	$(listename).show();
	if (config.with_graphique_on_tag_page==true){
		diplayHighchartAccueil("#acceuilPage");
	}
	//$(listename+' li').parent().trigger('create');
	//
	//$('#acceuilPage').trigger('create');
	//$('#graphiquebutton').hide();
	//$('#tagbutton').html("Pieces");
}



$(document).on("pageshow",function(event){
	
	showpage=event.target.id;
	appliquetitreperso();
	
});
















function appliquetitreperso(){
	icon="";
	if (config.icon_application) {
		icon='<img id="icon" src="'+imagesURL+config.icon_application.path+'" height="'+config.icon_application.height+'" width="'+config.icon_application.width+'"/>';
	}
	if (config.icon_application || config.titre_application) {
		$('#'+showpage).find('#titre').html(icon+" "+config.titre_application.name);
		$('#'+showpage).find('#titre').css('font-size',config.titre_application.size+'px')
	}
	
	
	
}


