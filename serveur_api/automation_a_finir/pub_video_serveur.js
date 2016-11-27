/**
 * New node file
 */
var pub_video_serveur={id:15,nom:"pub_video_serveur",etat:"OFF",lastrun:null};

serveur_video=null;

pub_video_serveur.start=function(){
	if (pub_video_serveur.etat=='OFF') {
		pub_video_serveur.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		serveur_video.listen(8888);
	}
}

pub_video_serveur.stop=function(){
	if (pub_video_serveur.etat=='ON') {
		pub_video_serveur.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		serveur_video.close();
	}
}


serveur_video=GLOBAL.req.http.createServer(function (req, res) {
	
		if (req.url != "/pub.m4v" && req.url != "/BigBuck.m4v") {
			res.writeHead(200, { "Content-Type": "text/html" });
			res.end('<video src="http://localhost:8888'+req.url+'"></video>');
		} else {
		var file = GLOBAL.req.path.resolve(__dirname,"../.."+req.url);
		/*var range = req.headers.range;
		var positions=[0,];
		if (range){
			positions = range.replace(/bytes=/, "").split("-");
		}*/
		console.log(req.headers);

		GLOBAL.req.fs.stat(file, function(err, stats) {
			var total = stats.size;
			var range = req.headers.range;
			var positions=["0"];

			if (range){
				positions = range.replace(/bytes=/, "").split("-");
			}
			var start = parseInt(positions[0], 10);
			
		 
		  var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
		  var chunksize = (end - start) + 1;
		  if (req.url=="/pub.m4v") 
			  res.writeHead(206, {
			    "Content-Range": "bytes " + start + "-" + end + "/" + total,
			    "Accept-Ranges": "bytes",
			    "Content-Length": chunksize,
			    "Content-Type": "video/mp4"
			  });
		  if (req.url=="/BigBuck.m4v") 
			  res.writeHead(206, {
			    "Content-Range": "bytes " + start + "-" + end + "/" + total,
			    "Accept-Ranges": "bytes",
			    "Content-Length": chunksize,
			    "Content-Type": "video/m4v"
			  });
		  
		  console.log('start video : '+start + ' to '+end + " / " + total);
		  var stream = GLOBAL.req.fs.createReadStream(file, { start: start, end: end })
		    .on("open", function() {
		    	console.log('stream open');
		      stream.pipe(res);
		      
		    }).on("error", function(err) {
		      res.end(err);
		      console.log('stream error');
		      console.log(err);
		    });
		});
		}
		});



module.exports = pub_video_serveur;