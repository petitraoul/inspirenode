/**
 * New node file
 */

/*d�claration des classes requise*/
var reqarray=[	{name:'request',require:'request'},
	            {name:'querystring',require:'querystring'},
	            {name:'http',require:'http'},
	            {name:'events',require:'events'},
	            {name:'url',require:'url'},
	            {name:'mime',require:'mime'},
	            {name:'path',require:'path'},
	            {name:'fs',require:'fs'},
	            {name:'xml2js',require:'xml2js'},
	            {name:'sqlite3',require:'sqlite3'},
	            {name:'mysql',require:'mysql'},
	            {name:'async',require:'async'},
	            {name:'os',require:'os'},
	            {name:'moment',require:'moment'},
	            /*{name:'emailjs',require:'emailjs'},*/
	            {name:'i2c',require:'i2c'},
	            {name:'jsmodbus',require:'jsmodbus'},
	            {name:'sonos',require:'sonos'},
	            {name:'soap',require:'soap'},
	            {name:'child_process',require:'child_process'},
	            {name:'serialport',require:'serialport'},
	            {name:'schedule',require:'node-schedule'},

	            {name :"logger",require:'./serveur_api/logger'},
	            {name :"logger_request",require:'./serveur_api/logger_request'},
	            {name:'utils',require:'./serveur_api/utils'},
	            
	            {name:'comm_with_virtuel',require:'./serveur_api/comm_with_virtuel'},
	            {name:'comm_with_ipx800',require:'./serveur_api/comm_with_ipx800'},
	            {name:'comm_with_ipxV4',require:'./serveur_api/comm_with_ipxV4'},
	            {name:'comm_with_eco_device',require:'./serveur_api/comm_with_eco_device'},
	            {name:'comm_with_cameradomesony',require:'./serveur_api/comm_with_cameradomesony'},
	            {name:'comm_with_cameraipfoscam',require:'./serveur_api/comm_with_cameraipfoscam'},
	            {name:'comm_with_sonos',require:'./serveur_api/comm_with_sonos'},
	            {name:'comm_with_infoOS',require:'./serveur_api/comm_with_infoOS'},
	            {name:'comm_with_onduleur',require:'./serveur_api/comm_with_onduleur'},
	            
	            {name:'comm_with_zway',require:'./serveur_api/comm_with_zway'},
	            {name:'comm_with_i2c',require:'./serveur_api/comm_with_i2c'},
	            {name:'comm_with_modbus',require:'./serveur_api/comm_with_modbus'},
	            {name:'comm_with_modbuscoils',require:'./serveur_api/comm_with_modbuscoils'},
				{name:'comm_with_modbusinteger',require:'./serveur_api/comm_with_modbusinteger'},
				{name:'comm_with_modbus_real',require:'./serveur_api/comm_with_modbus_real'},
	            {name:'comm_with_domoticz',require:'./serveur_api/comm_with_domoticz'},
	            {name:'comm_with_arduino_pwm',require:'./serveur_api/comm_with_arduino_pwm'},
	            {name:'comm_with_arduino_meteo',require:'./serveur_api/comm_with_arduino_meteo'},
	            {name:'comm_with_sms',require:'./serveur_api/comm_with_sms'},
	            {name:'comm_with_mail',require:'./serveur_api/comm_with_mail'},
	            {name:'comm_with_inspirenode_box',require:'./serveur_api/comm_with_inspirenode_box'},
	            {name:'comm_with_inspirenode_periph',require:'./serveur_api/comm_with_inspirenode_periph'},
	            
	            {name:'request_action',require:'./serveur_api/request_action'},	            
	            {name:'request_action_piping',require:'./serveur_api/request_action_piping'},
	            {name:'request_action_maj',require:'./serveur_api/request_action_maj'},
	            {name:'request_action_get',require:'./serveur_api/request_action_get'},
	            {name:'request_action_set',require:'./serveur_api/request_action_set'},
	            {name:'request_action_push',require:'./serveur_api/request_action_push'},
	            {name:'request_action_update',require:'./serveur_api/request_action_update'},
	            {name:'request_action_appliphp',require:'./serveur_api/request_action_appliphp'},
	            {name:'request_action_applipiscine',require:'./serveur_api/request_action_applipiscine'},
	            
	            {name:'comm',require:'./serveur_api/comm.js'},
	            {name : "server",require:'./serveur_api/server.js'},
	            {name : "core",require:'./serveur_api/core.js'},
	            {name:'database',require:'./serveur_api/database.js'},
	            
	            {name : "categorie",require:'./serveur_api/class_categorie'},
	            {name : "constante",require:'./serveur_api/class_constante'},
	            {name : "tag",require:'./serveur_api/class_tag'},
	            {name : "box",require:'./serveur_api/class_box'},
	            {name : "mode",require:'./serveur_api/class_mode'},
	            {name : "type",require:'./serveur_api/class_type'},
	            {name : "consigne",require:'./serveur_api/class_consigne'},
	            {name : "peripherique",require:'./serveur_api/class_peripherique'},
	            {name : "periph_deporte",require:'./serveur_api/class_periph_deporte'},
	            {name : "periph_chauffage",require:'./serveur_api/class_periph_chauffage'},
	            {name : "periph_alarme",require:'./serveur_api/class_periph_alarme'},
	            {name : "periph_batterie",require:'./serveur_api/class_periph_batterie'},
	            
	            {name : "serverhttp",require:'./serveur_http/serverhttp.js'},
	            {name:'httpdispatcher',require:'./serveur_http/httpdispatcher'},
	            {name:'dbmodel',require:'./dbmodel_piscine'}//,
	            //{name:'dbmodel',require:'./dbmodel_camping'}
			];
			
applicationtype='inspirepiscine';

GLOBAL.req={};
for (var c in reqarray){
	var req=reqarray[c];
	try {
		GLOBAL.req[req.name]= require(req.require);
	} catch (e) {
		console.log('!!! Impossible de charger la librairie '+req.require);
	}
	
}

/*gestion d'objet partag�*/
GLOBAL.obj={};

var app = function(){
	
	this.config= require('./config_app_piscine.json');
	if (this.config.apiport==this.config.httpport) this.config.apiport-=1;
	this.get_ip=function(){
		var interfaces = GLOBAL.req.os.networkInterfaces();
		var addresses = [];
		for (var k in interfaces) {
		    for (var k2 in interfaces[k]) {
		        var address = interfaces[k][k2];
		        if (address.family === 'IPv4' && !address.internal) {
		            addresses.push(address.address);
		        }
		    }
		}
		//console.log(addresses);
		if (addresses.length==0){
			addresses.push('127.0.0.1');
		}
		
		return addresses;
	}
	
	this.adresseip=this.get_ip()[0];
	this.db=new GLOBAL.req.database();
	
	this.serveur = new GLOBAL.req.server(this.adresseip,this.config.apiport);
	this.serveurhttp = new GLOBAL.req.serverhttp(this.adresseip, this.config.httpport);
	this.core = new GLOBAL.req.core();
	this.serveur.on(null,function(event,arg,arg2){
		console.log(event);
	});
	this.serveur.on('serveur_api.start',function(port,adresseip){
		logger('INFO','Serveur de communication démarré http://'+adresseip+':'+port,'startstop');
		console.log('Serveur de communication démarré http://'+adresseip+':'+port);
	});
	this.serveurhttp.on('serveur_http.start',function(port,adresseip){
		logger('INFO','Serveur web démarré http://'+adresseip+':'+port,'startstop');
		console.log('Serveur web start démarré http://'+adresseip+':'+port);
	});
};
process.on('unhandledRejection', function(reason, p) {
    
    logger('ERROR',{erreur:"Unhandled Rejection at: Promise ",reason:reason,p:p},'crashed');
    // application specific logging, throwing an error, or other logic here
});
process.on('uncaughtException', function(err) {
	 var st=err.stack;
	  //console.log('Capture d erreur:');
	  //console.log(st);
	  logger('ERROR',{erreur:'uncaughtException',stack:st},'erreur');

});

logger('INFO','app '+applicationtype+' server start','startstop');
var serverapp=new app();
GLOBAL.obj['app']=serverapp;
serverapp.db.controledatabase();
//console.log('Chargement des objets');

serverapp.core.charge_all(function(){
	//console.log('Chargement des objets termin�s');
	logger('INFO','Chargement des objets terminés','startstop');
	try {
		serverapp.serveur.start();
		serverapp.serveurhttp.start();			
	} catch (e) {
		logger('ERROR','Port déjà utilisés, application en cours','startstop');
	}

	
	GLOBAL.automation={};
	var fileautomations=GLOBAL.req.fs.readdirSync(__dirname+'/serveur_api/automation/');

	for (var i = 0; i < fileautomations.length; i++) {
		var f=function(fileautomations,i){
		setTimeout(function(){
			try {
				var automationfile=fileautomations[i];
				var name=automationfile.split(".")[0];
				logger('INFO','Automation chargement '+name ,'startstop');
				
				GLOBAL.automation[name]= require('./serveur_api/automation/'+automationfile);
				logger('INFO','Automation chargée ('+GLOBAL.automation[name].id+') '+GLOBAL.automation[name].nom ,'startstop');
				//GLOBAL.automation[name].start();			
			} catch (e) {
				logger('ERROR','Impossible de chargé l\'automation '+fileautomations[i],'startstop');
			}			
		},0);
		}(fileautomations,i);


	}
	var sql='Select * from automation_etat where etat=\'ON\' order by id;';
	GLOBAL.obj.app.db.sqlorder(sql,
		function(rows_automat){
			for (var r in rows_automat) {
				var f=function(rows,r){
				setTimeout(function(){
					try {
						var exist=false;
						for (var a_id in GLOBAL.automation) {
							//GLOBAL.automation[a_id].etat_id=rows[r].id;
							
							if (GLOBAL.automation[a_id].id==rows[r].id_automation) {
								
								exist=true;
								//console.log(rows[r].nom+" ==> start "+rows[r].id_automation);
								if (rows[r].etat=='ON') {
									logger('INFO','Automation starting (id='+rows[r].id_automation+'), '+rows[r].nom ,'startstop');
									try {
										GLOBAL.automation[a_id].start();
										logger('INFO','Automation started (id='+GLOBAL.automation[a_id].id+'), '+GLOBAL.automation[a_id].nom+' etat='+GLOBAL.automation[a_id].etat ,'startstop');
									} catch (e) {
										logger('ERROR',{msg:'Automation starting (id='+GLOBAL.automation[a_id].id+'), '+GLOBAL.automation[a_id].nom+' etat='+GLOBAL.automation[a_id].etat,error:e},'startstop');
									}										
								}
							}
						}
						var sqldel="delete from automation_etat where id_automation is null or id_automation =\'undefined\';";
						GLOBAL.obj.app.db.sqltrans(sqldel,function(){});
						if (!exist){
							logger('WARNING','Automation introuvable (id='+rows[r].id+'), suppression de l etat ON','startstop');
							
							var sqldel="delete from automation_etat where id_automation='"+rows[r].id+"';";
							GLOBAL.obj.app.db.sqltrans(sqldel,function(){});
						}
		
					} catch (e) {
						logger('ERROR',{msg:'Automation starting ',row:rows[r],error:e},'startstop');
						
					}		
				},3000);
				}(rows_automat,r);
			}
		});
	
	
	GLOBAL.graphique={};
	var filegraphiques=GLOBAL.req.fs.readdirSync(__dirname+'/serveur_api/graphique/');

	for (var i = 0; i < filegraphiques.length; i++) {
		
		var graphiquefile=filegraphiques[i];
		var name=graphiquefile.split(".")[0];
		//console.log(graphiquefile+" ==> " + name);
		
		GLOBAL.graphique[name]= require('./serveur_api/graphique/'+graphiquefile);
		GLOBAL.graphique[name].uuid=generateUUID();
		//GLOBAL.automation[name].start();
	}

});



