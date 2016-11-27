

$(document).on("pagecreate","#Vacancier_Acceuil_Page",function(){ // When entering pagetwo

	//alert('acceuil show');
	getJsonObject(startpubs,'index.php?type=get&action=listpubs&v='+version);

});

function startpubs(dataj){
		var data=dataj.files;
		if(!data) data=dataj;
		var racine=imagesURL;
		if (dataj.racine) racine=dataj.racine;
		//var repertoire="";
		
		//alert('startpubs');
		if (isitdevice())	{
			repertoire=cordova.file.dataDirectory;
			//alert('repertoire '+repertoire);
			for (v in data) {
				//alert('v of data '+v);
				var callbackv=function(){};
				if (v==0) callbackv=function(fileentry,filepathname,filename){
					//alert('callbackv '+filepathname);
					//$("#telechargementvideo").html("");
					startplayer(repertoire,data);
					
				};
				//alert('get '+racine+data[v].id);
				
				var dwnv=new downloadtask(racine+data[v].id,data[v].nom,callbackv,repertoire,data[v].size,
						function (progressLoaded,Totalsize,filename) {
					//if (pourcentprogress<=99){
						
						//var progress=(Totalsize/progressLoaded).toFixed();
						//$("#telechargementvideo").html("Downloading "+filename+" "+progressLoaded+" "+Totalsize);
					//} else {
					//	$("#telechargement_video").html("");
					//}
					
					
				})
				
				dwnv.GetFile();
			}
		} else {
			/*for (v in data) {
				alert('v of data '+v);
				var callbackv=function(){};
				if (v==0) callbackv=function(fileentry,filepathname){
					alert('callbackv '+filepathname);
					startplayer(repertoire,data);
					
				};
				var dwnv=new downloadtask(imagesURL+data[v].id,data[v].nom,callbackv,repertoire,data[v].size)
				
				dwnv.GetFile();
			}*/
			//repertoire=imagesURL+'pubs/';
			//$("#telechargementvideo").html("");
			startplayer(racine+'pubs/',data);
		}
		


}
function startplayer(repertoire,data){
		var playlistpub=[];
		for (v in data) {
			var video={title:data[v].nom,name:data[v].nom,m4v:repertoire+data[v].nom};
			playlistpub.push(video);
		}
		
		//var videofilename=cordova.file.dataDirectory+"pub.m4v";
		//alert('startplayer ');
		var indexvideo=0;
		$("#jquery_jplayer_1").jPlayer({
	        ready: function () {
	        	//alert('PLAY ');
	          $(this).jPlayer("setMedia", playlistpub[indexvideo]).jPlayer("play");
	        },
			ended: function() { 
				indexvideo++;
				if (indexvideo>=playlistpub.length) indexvideo=0;
				$(this).jPlayer("setMedia", playlistpub[indexvideo]).jPlayer("play");
				
			},
	        /*cssSelectorAncestor: "#jp_container_1",*/
	        swfPath: "/js",
	        supplied: "m4v, ogv",
	        loop: true,
	        useStateClassSkin: true,
	        autoBlur: false,
	        smoothPlayBar: true,
	        keyEnabled: true,
	        remainingDuration: true,
	        toggleDuration: true,
	        size: {
	            width: "100%",
	            height: "auto"
	       }
	      });

}
