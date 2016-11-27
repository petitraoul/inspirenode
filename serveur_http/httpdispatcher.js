/**
 * New node file
 */
/*var url = require('url');
var fs = require('fs');
var mime = require('mime');*/
//var pathl = require('path');

var dispatcher= function(req,res){
	var url_parts = GLOBAL.req.url.parse(req.url, true);
	var variables=url_parts.query;
	var path=url_parts.pathname;
	
	
	
	if (req.method=='POST') {
		var body="";
		req.on('data', function (data) {
			if (!body) body="";
            body += data.toString();
            //console.log("Partial body: " + body);
        });
        req.on('end', function () {
        	//console.log('POST: '+path+JSON.stringify(variables));
        	if (body) {
        		variables.data=(body); 
        		console.log("Body: " + body);	
        	}
        	res.writeHead(200, {'Content-Type': 'text/html',
				'Access-Control-Allow-Origin': '*'});
        	res.end(body);
        	

        });
	}
	
	var remoteip=req.connection.remoteAddress;
	var pathdefaut="";
	switch (applicationtype) {
	case 'inspireairevoyage':
		pathdefaut="/appliairevoyage/index.html";
		break;
	case 'inspirepiscine':
		pathdefaut="/applipiscine/index.html";
		break;
	case 'inspireacces':
		pathdefaut="/appliacces/main.html";
		break;
	case 'inspirecamp':
		pathdefaut="/applicamp/main.html";
		break;
	case 'inspireindus':
		pathdefaut="/appliindus/main.html";
		break;
	case 'inspireathome':
		pathdefaut="/appli/main.html";
		break;
	default:
		break;
	}
	
	if (path.substr(0,6)=='/index' || path.substr(0,5)=='/main'){
		//console.log('ok');
		//console.log('api',path);
		GLOBAL.obj.app.serveur.receivereq(req,res);
	} else if (path && path!="/" && GLOBAL.req.fs.existsSync(__dirname+"/.."+path)) {
		//logger('INFO',{remoteip:remoteip,msg:'requete utilisteur',requete:url_parts},'http_serveur');
		
		logger_request('INFO',{remoteip:remoteip,msg:'requete utilisteur',requete:url_parts},'http_serveur');
		var content_type=GLOBAL.req.mime.lookup(__dirname+"/.."+path);
		//if (content_type=='application/json') content_type='application/x-javascript';
		try {
			var content=GLOBAL.req.fs.readFileSync(__dirname+"/.."+path);
			//console.log('HTTP: '+path+variables);
			//console.log('http ok',path);
			res.writeHead(200, {'Content-Type': content_type,
								'Access-Control-Allow-Origin': '*'});

			res.end(content);
		} catch (e) {
			logger_request('WARNING',{remoteip:remoteip,msg:'mauvaise requete',requete:url_parts},'http_serveur');
			/*res.writeHead(404, {'Content-Type': 'text/html',
								'Access-Control-Allow-Origin': '*'});
			res.end("Bye");*/

			//console.log('pathdefaut',path,pathdefaut);
			var content_type=GLOBAL.req.mime.lookup(__dirname+"/.."+pathdefaut);
			//if (content_type=='application/json') content_type='application/x-javascript';
			var content=GLOBAL.req.fs.readFileSync(__dirname+"/.."+pathdefaut);
			//console.log('HTTP: '+path+variables);
			res.writeHead(200, {'Content-Type': content_type,
								'Access-Control-Allow-Origin': '*'});

			res.end(content);
		}

	} else {
		//logger('WARNING',{remoteip:remoteip,msg:'mauvaise requete',requete:url_parts},'http_serveur');
		
		/*logger_request('WARNING',{remoteip:remoteip,msg:'mauvaise requete',requete:url_parts},'http_serveur');

		res.writeHead(404, {'Content-Type': 'text/html',
			'Access-Control-Allow-Origin': '*'});
		res.end("Bye");*/
		logger_request('WARNING',{remoteip:remoteip,msg:'mauvaise requete',requete:url_parts},'http_serveur');
		/*res.writeHead(404, {'Content-Type': 'text/html',
							'Access-Control-Allow-Origin': '*'});
		res.end("Bye");*/

		//console.log('pathdefaut',path,pathdefaut);
		var content_type=GLOBAL.req.mime.lookup(__dirname+"/.."+pathdefaut);
		//if (content_type=='application/json') content_type='application/x-javascript';
		var content=GLOBAL.req.fs.readFileSync(__dirname+"/.."+pathdefaut);
		//console.log('HTTP: '+path+variables);
		res.writeHead(200, {'Content-Type': content_type,
							'Access-Control-Allow-Origin': '*'});

		res.end(content);

	} 


}

module.exports = dispatcher;
