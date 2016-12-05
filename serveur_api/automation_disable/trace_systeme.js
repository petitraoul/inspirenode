/**
 * New node file
 */
var trace_systeme={id:78,nom:"trace_systeme",etat:"OFF",lastrun:null};
var timer=null;
//var sizeof = require('object-sizeof');

trace_systeme.start=function(){
	if (trace_systeme.etat=='OFF' ) {
		trace_systeme.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		process.chdir('/home/pi');
	
		setTimeout(function(){
			log_etat_system();
			//log_etat_appli();	
		}, 30000);
		timer=setInterval(function(){
			log_etat_system();
			//log_etat_appli();	
		}, 1800000);
	}
}

trace_systeme.stop=function(){
	if (trace_systeme.etat=='ON') {
		trace_systeme.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		clearInterval(timer);
	}

}
function log_etat_system(){
	var exec = spawn=GLOBAL.req.child_process.exec;
	GLOBAL.req.async.waterfall([
            function(callback1){
            	var infos={platform:process.platform};
        		exec('node -v', function(error, stdout, stderr) {
        			if (stderr) {
        				infos.node_v=stderr;
        				callback1(null,infos);
        			} else if (stdout) {
        				infos.node_v=stdout;
        				callback1(null,infos);
        			}
        		    if (error !== null) {
        		    	callback1(null,infos);
        		    }
        		});
            },function(infos,callback1){
            	if (process.platform=='linux'){
            		exec('df -h', function(error, stdout, stderr) {
            			if (stderr) {
            				infos.espace_disk=stderr;
            				callback1(null,infos);
            			} else if (stdout) {
            				infos.espace_disk=stdout;
            				callback1(null,infos);
            			}
            		    if (error !== null) {
            		    	callback1(null,infos);
            		    }
            		});
            	} else {
            		callback1(null,infos);
            	}

            },function(infos,callback1){
            	if (process.platform=='linux'){
            		exec('free -m', function(error, stdout, stderr) {
            			if (stderr) {
            				infos.memoire=stderr;
            				callback1(null,infos);
            			} else if (stdout) {
            				infos.memoire=stdout;
            				callback1(null,infos);
            			}
            		    if (error !== null) {
            		    	callback1(null,infos);
            		    }
            		});
            	} else {
            		callback1(null,infos);
            	}

            },function(infos,callback1){
            	if (process.platform=='linux'){
            		exec('date', function(error, stdout, stderr) {
            			if (stderr) {
            				infos.date=stderr;
            				callback1(null,infos);
            			} else if (stdout) {
            				infos.date=stdout;
            				callback1(null,infos);
            			}
            		    if (error !== null) {
            		    	callback1(null,infos);
            		    }
            		});
            	} else {
            		callback1(null,infos);
            	}

            },function(infos,callback1){
            	if (process.platform=='linux'){
            		exec('echo $PATH', function(error, stdout, stderr) {
            			if (stderr) {
            				infos.path=stderr;
            				callback1(null,infos);
            			} else if (stdout) {
            				infos.path=stdout;
            				callback1(null,infos);
            			}
            		    if (error !== null) {
            		    	callback1(null,infos);
            		    }
            		});
            	} else {
            		callback1(null,infos);
            	}

            },function(infos,callback1){
            	if (process.platform=='linux'){
            		exec(' netstat -paun', function(error, stdout, stderr) {
            			if (stderr) {
            				infos.netstat=stderr;
            				callback1(null,infos);
            			} else if (stdout) {
            				infos.netstat=stdout;
            				callback1(null,infos);
            			}
            		    if (error !== null) {
            		    	callback1(null,infos);
            		    }
            		});
            	} else {
            		callback1(null,infos);
            	}

            }]
	,function(err,infos){
		/*path,netstat,date,memoire,espace_disk,node_v*/
		logger('INFO',{msg:'date',info:infos.date},'system_trace');
		logger('INFO',{msg:'path',info:infos.path},'system_trace');
		logger('INFO',{msg:'node_v',info:infos.node_v},'system_trace');
		logger('INFO',{msg:'espace_disk',info:infos.espace_disk},'system_trace');
		logger('INFO',{msg:'memoire',info:infos.memoire},'system_trace');
		logger('INFO',{msg:'netstat',info:infos.netstat},'system_trace');

    });
}
function log_etat_appli(){
	var sizeTotal=0;
	var size=0;
	for ( var o in GLOBAL.obj) {
		try {		
			//size=sizeof(GLOBAL.obj[o]);
			sizeTotal+=size;
			//logger('INFO',{msg:'taille ',nom:'GLOBAL.obj.'+o,bytes:sizeof(GLOBAL.obj[o])},'system_trace');

		} catch (e) {
		}		
	}
	for ( var o in GLOBAL.req) {
		try {		
			//size=sizeof(GLOBAL.req[o]);
			sizeTotal+=size;
			//logger('INFO',{msg:'taille ',nom:'GLOBAL.obj.'+o,bytes:sizeof(GLOBAL.obj[o])},'system_trace');

		} catch (e) {
		}		
	}
	//logger('INFO',{msg:'*******Total : ',bytes:sizeTotal},'system_trace');
	//logger('INFO',{msg:'*******Total : ',Mo:(sizeTotal/1024/1024)},'system_trace');

}

module.exports = trace_systeme;