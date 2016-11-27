
//var refreshcamera=false;
$(document).on("pagehide","#camerapage",function(){
	
	$("#camerapage").find('#cameraview').attr('src',"");
});
$(document).on("pagecreate","#camerapage",function(){ // When entering pagetwo
	

	$( "#entete" ).children().css( "margin-top", "20px" );
	busycam=false;
	

/*	timercam=setTimeout(function(){
		//if (!busycam && refreshcamera){
			//busycam=true;
			
			$("#camerapage").find('#cameraview').attr('src',cameraURL+"&time="+ new Date().getTime());
			//alert('refresh cam');
			//busycam=false;
		//}
	},200);*/
	/*$('#cameraview')
	.load(function(){
		busycam=false;
		date = new Date();
		n = date.toDateString();
		time = date.toLocaleTimeString();
		//alert(n + ' ' + time);
		//$('#dateheure').html(n + ' ' + time);
	})
	.error(function(){
		busycam=false;
	});*/

	//alert('test cam');
	$('#camerapage').trigger('create');
	EntetePageTaille();
	});
function cameramove(direction){
	var command="";
	switch (direction) {
	case 'LEFT':
		command='ON';
		break;
	case 'UP':
		command='UP';
		break;
	case 'DOWN':
		command='DOWN';
		break;
	case 'RIGHT':
		command='OFF';
		break;
	default:
		break;
	}
	   var linkON="index.php?action=setetat&valeur="+new Date().getTime()+"&cmd="+command+"&uuid="+cameraUUID;
	   sendaction( linkON );
}
$(document).on("pageshow","#camerapage",function(){ // When entering pagetwo
	//alert('test cam');

	//$('#camerapage').trigger('create');
	//refreshcamera=true;
	EntetePageTaille("#camerapage");
	//$("#camerapage").trigger('pagecreate');
	var date = new Date();
	var n = date.toDateString();
	var time = date.toLocaleTimeString();
	//alert(n + ' ' + time);
	$('#dateheure').html(n + ' ' + time);
	//$("#camerapage").find('#cameraview').load(function() {
	$("#camerapage").find('#cameraview').attr('src',cameraURL+"&keep=0&time="+ new Date().getTime());
	//});
	
	
	
});

$(document).on("pagebeforehide","#camerapage",function(){ // When entering pagetwo
	//refreshcamera=false;
	//clearTimeout(timercam);
	$("#camerapage").find('#cameraview').attr('src',"");
});