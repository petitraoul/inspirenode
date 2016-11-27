/**
 * New node file
 */
var trace_systeme={id:78,nom:"trace_systeme",etat:"OFF",lastrun:null};
var timer=null;
var sizeof = require('object-sizeof');
var heapdump = require('heapdump')

trace_systeme.start=function(){
	if (trace_systeme.etat=='OFF' ) {
		trace_systeme.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		process.chdir('/home/pi');
		log_info_system();	
		heapdump.writeSnapshot()
	}
}

trace_systeme.stop=function(){
	if (trace_systeme.etat=='ON') {
		trace_systeme.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');

	}

}

function log_info_system(){
	var sizeTotal=0;
	var size=0;
	for ( var o in GLOBAL.obj) {
		try {		
			size=sizeof(GLOBAL.obj[o]);
			sizeTotal+=size;
			console.log('GLOBAL.obj.'+o+':'+sizeof(GLOBAL.obj[o])+'bytes');
		} catch (e) {
			console.error(o+'=='+e);
		}		
	}
	for ( var o in GLOBAL.req) {
		try {		
			size=sizeof(GLOBAL.req[o]);
			sizeTotal+=size;
			console.log('GLOBAL.req.'+o+':'+sizeof(GLOBAL.req[o])+' octets');
		} catch (e) {
			console.error(o+'=='+e);
		}		
	}
	console.log('*******Total : '+sizeTotal+'bytes');
	console.log('*******Total : '+(sizeTotal/1024/1024)+' Mo');
}

module.exports = trace_systeme;