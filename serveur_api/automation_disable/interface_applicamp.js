/**
 * New node file
 */
var parserxml2json = new GLOBAL.req.xml2js.Parser();
var soap = GLOBAL.req.soap;

var interface_applicamp={id:201,nom:"interface_applicamp",etat:"OFF",lastrun:null};
var timer=null;
var config={http_adr_service:"http://aimcia1.dnsalias.com/INSPIRELEC_WEB/awws/INSPIRELEC.awws"};
var lastupdatetime={};

interface_applicamp.start=function(){
	if (interface_applicamp.etat=='OFF') {
		interface_applicamp.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		timer=setTimeout(function(){
			//console.log(data);
			start_webservice();
			boucle_recupinfo();
		},3000);
	}
}

interface_applicamp.stop=function(){
	if (interface_applicamp.etat=='ON') {
		interface_applicamp.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		clearInterval(timer);
	}
}


function boucle_recupinfo(){
	  var self=this;
	  var url = 'http://aimcia1.dnsalias.com/INSPIRELEC_WEB/awws/INSPIRELEC.awws?wsdl';

	  soap.createClient(url, function(err, client) {
		  GLOBAL.req.async.series([
                       function(callback1){
                 		  var args = {date_debut:'20160101',date_fin:''};
                		  client.liste_emplacements(args, function(err, soapResult) {
                	          console.log('liste_emplacements',soapResult);
                				try {
                					parserxml2json = new GLOBAL.req.xml2js.Parser();
                					parserxml2json.parseString(soapResult.liste_emplacementsResult, function (err, result) {
                						var res={};
                						if (result && result.LISTE_EMPLACEMENT && result.LISTE_EMPLACEMENT.EMPLACEMENT) {
                							console.log('nombre d emplacement',result.LISTE_EMPLACEMENT.EMPLACEMENT.length);
                							GLOBAL.req.async.eachSeries(result.LISTE_EMPLACEMENT.EMPLACEMENT, function(empl,callbackDone){
                								/*empl soap :
                								 * NUMEMPL,DEBUT_PERIODE,FIN_PERIODE,AMENAGEMENT,EQUIPEMENT,GESTIONNAIRE,CLASSEMENT,
                								 * AVEC_ANIMAUX,COMMENTAIRE
                								 */
                								var elesave={action:'save',element:'tag',data:{}};
                								var localempl=GLOBAL.obj.app.core.findobj('applicamp'+empl.NUMEMPL[0].trim(),'tags');
                								if (localempl){
                									elesave.data=localempl;
                								} else {
                									elesave.data={};
                									elesave.data.uuid='applicamp'+empl.NUMEMPL[0].trim();
                								}
                								elesave.data.nom=empl.NUMEMPL[0];
                								elesave.data.debut_periode=empl.DEBUT_PERIODE[0];
                								elesave.data.fin_periode=empl.FIN_PERIODE[0];
                								elesave.data.amenagement=empl.AMENAGEMENT[0];
                								elesave.data.equipement=empl.EQUIPEMENT[0];
                								elesave.data.classement=empl.CLASSEMENT[0];
                								elesave.data.avec_animaux=empl.AVEC_ANIMAUX[0];
                								elesave.data.gestionnaire=empl.GESTIONNAIRE[0];
                								elesave.data.commentaire=empl.COMMENTAIRE[0];
                								//console.log(empl.NUMEMPL[0]);
                								GLOBAL.obj.app.core.majdb(elesave,function(){
                									//console.log('saved');
                									callbackDone();},true);
                								
                							}, 
                							function (err) {
                								GLOBAL.obj.app.core.charge_all(function(){
                									/*fin*/
                									callback1();
                								});
                							});
                						}
                					});		
                				} catch (e) {
                					console.error(e);
                					logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml',soapResult:soapResult},'interface_applicamp');
                					callback1();
                				}
                	      });
                       },
                       
                       function(callback2){
                    	   var args = {};
                 		  client.liste_etat(args, function(err, soapresult) {
                 	          console.log('liste_etat',soapresult.liste_etatResult);
                 				try {
                 					parserxml2json = new GLOBAL.req.xml2js.Parser();
                 					parserxml2json.parseString(soapresult.liste_etatResult, function (err, result) {
                 						var res={};
                 						if (result && result.LISTE_ETAT && result.LISTE_ETAT.ETAT) {
                 							console.log('nombre d etat',result.LISTE_ETAT.ETAT.length);
                 							GLOBAL.req.async.eachSeries(result.LISTE_ETAT.ETAT, function(etat,callbackDone){
                 								/*etat soap :
                 								 * IDPOSTE,LIBELLE
                 								 */
                 								var elesave={action:'save',element:'taches_etat',data:{}};
                 								var sql="select * from "+elesave.element+" where uuid=?";
                 	            				GLOBAL.obj.app.db.sqlorder(sql,
                 		            				function(rows){
                 	            						if (rows && rows[0]){
                 	            							elesave.data=rows[0];
                 	            						} else {
                 	            							elesave.data={};
                 	    									elesave.data.uuid='applicamp'+etat.IDPOSTE[0].trim();
                 	            						}
                 	            						elesave.data.nom=etat.LIBELLE[0];
                 	    								GLOBAL.obj.app.core.majdb(elesave,function(){
                 	    									//console.log('saved');
                 	    									callbackDone();},true);
                 		            				},['applicamp'+etat.IDPOSTE[0].trim()]);	
                 								
                 							}, 
                 							function (err) {
                 								//GLOBAL.obj.app.core.charge_all(function(){
                 									/*fin*/
                 								//});
                 								callback2();
                 							});
                 						}
                 					});		
                 				} catch (e) {
                 					console.error(e);
                 					logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml',soapResult:soapresult.liste_etatResult},'interface_applicamp');
                 					callback2();
                 				}
                 	      });
                       },
                       function (callback3){
                    	   var args = {};
                 		  client.liste_type_taches(args, function(err, soapresult) {
                	          console.log('liste_type_taches',soapresult.liste_etatResult);
                				try {
                					parserxml2json = new GLOBAL.req.xml2js.Parser();
                					parserxml2json.parseString(soapresult.liste_type_tachesResult, function (err, result) {
                						var res={};
                						if (result && result.LISTE_TYPE_TACHES && result.LISTE_TYPE_TACHES.TYPE_TACHE) {
                							console.log('nombre de type de taches',result.LISTE_TYPE_TACHES.TYPE_TACHE.length);
                							GLOBAL.req.async.eachSeries(result.LISTE_TYPE_TACHES.TYPE_TACHE, function(type,callbackDone){
                								/*etat soap :
                								 * IDTYPE_TACHE,LIBELLE
                								 */
                								var elesave={action:'save',element:'taches_type',data:{}};
                								var sql="select * from "+elesave.element+" where uuid=?";
                	            				GLOBAL.obj.app.db.sqlorder(sql,
                		            				function(rows){
                	            						if (rows && rows[0]){
                	            							elesave.data=rows[0];
                	            						} else {
                	            							elesave.data={};
                	    									elesave.data.uuid='applicamp'+type.IDTYPE_TACHE[0].trim();
                	            						}
                	            						elesave.data.nom=type.LIBELLE[0];
                	    								GLOBAL.obj.app.core.majdb(elesave,function(){
                	    									//console.log('saved');
                	    									callbackDone();},true);
                		            				},['applicamp'+type.IDTYPE_TACHE[0]]);
                								
                							}, 
                							function (err) {
                								//GLOBAL.obj.app.core.charge_all(function(){
                									/*fin*/
                								//});
                								callback3();
                							});
                						}
                					});		
                				} catch (e) {
                					console.error(e);
                					logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml',soapResult:soapresult},'interface_applicamp');
                					callback3();
                				}
                	      });
                       },
                       function (callback4){
                 		  var args = {};
                		  client.liste_personnels(args, function(err, soapresult) {
                	          console.log('liste_personnels',soapresult);
                	          /*etat soap :
								 * IDPERSONNEL,NOM,PRENOM,IDPOSTE,ACCES_CAISSE,ACCES_MENAG_TECH
								 */
                				try {
                					parserxml2json = new GLOBAL.req.xml2js.Parser();
                					parserxml2json.parseString(soapresult.liste_personnelsResult, function (err, result) {
                						var res={};
                						if (result && result.LISTE_PERSONNEL && result.LISTE_PERSONNEL.PERSONNEL) {
                							console.log('nombre de personnels',result.LISTE_PERSONNEL.PERSONNEL.length);
                							GLOBAL.req.async.eachSeries(result.LISTE_PERSONNEL.PERSONNEL, function(perso,callbackDone){
                								/*etat soap :
                								 * IDPERSONNEL,NOM,PRENOM,IDPOSTE,ACCES_CAISSE,ACCES_MENAG_TECH
                								 */
                								var elesave={action:'save',element:'utilisateurs',data:{}};
                								var sql="select * from "+elesave.element+" where uuid=?";
                	            				GLOBAL.obj.app.db.sqlorder(sql,
                		            				function(rows){
                	            						if (rows && rows[0]){
                	            							elesave.data=rows[0];
                	            						} else {
                	            							elesave.data={};
                	    									elesave.data.uuid='applicamp'+perso.IDPERSONNEL[0].trim();
                	    									elesave.data.type='PERSONNEL';
                	            						}
                	            						elesave.data.nom=perso.NOM[0];
                	            						elesave.data.prenom=perso.PRENOM[0];
                	            						elesave.data.idposte=perso.IDPOSTE[0];
                	            						elesave.data.acces_caisse=perso.ACCES_CAISSE[0];
                	            						elesave.data.acces_menag_tech=perso.ACCES_MENAG_TECH[0];
                	            						
                	    								GLOBAL.obj.app.core.majdb(elesave,function(){
                	    									//console.log('saved');
                	    									callbackDone();},true);
                		            				},['applicamp'+perso.IDPERSONNEL[0]]);
                								
                							}, 
                							function (err) {
                								//GLOBAL.obj.app.core.charge_all(function(){
                									/*fin*/
                								//});
                								callback4();
                							});
                						}
                					});		
                				} catch (e) {
                					console.error(e);
                					logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml',soapResult:soapresult},'interface_applicamp');
                					callback4();
                				}
                	      });
                       },
                       function (callback5){
                 		  var args = {};
                		  client.liste_postes(args, function(err, soapresult) {
                	          console.log('liste_postes',soapresult);
                				try {
                					parserxml2json = new GLOBAL.req.xml2js.Parser();
                					parserxml2json.parseString(soapresult.liste_emplacementsResult, function (err, result) {
                						var res={};
                						if (result) {		
                						}
                						callback5();
                					});		
                				} catch (e) {
                					console.error(e);
                					logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml',soapResult:soapresult},'interface_applicamp');
                				}
                	      });
                       },
                       function (callback6){
                 		  var args = {};
                		  client.liste_taches(args, function(err, soapresult) {
                	          console.log('liste_taches',soapresult);
                				try {
                					parserxml2json = new GLOBAL.req.xml2js.Parser();
                					parserxml2json.parseString(soapresult.liste_emplacementsResult, function (err, result) {
                						var res={};
                						if (result) {		
                						}
                						callback6();
                					});		
                				} catch (e) {
                					console.error(e);
                					logger('ERROR',{nom:self.nom,id:self.id,msg:'Impossible de parser la réponse xml',soapResult:soapresult},'interface_applicamp');
                				}
                	      });
                       }    
                   ], 
	              function(err) { 
		  			//fin synchro
			  		console.log('Fin SYNCHRO');
	              });


	  });
}

function start_webservice(){
	  var myService = {
		      inspirenode: {
		    	  inspirenodeSOAP: {
		        	  ListeTaches: function(args) {
		                  return {
		                      name: 'test'
		                  };
		              },
		 
		              // This is how to define an asynchronous function. 
		              MyAsyncFunction: function(args, callback) {
		                  // do some work 
		                  callback({
		                      name: args.name
		                  });
		              },
		 
		              // This is how to receive incoming headers 
		              HeadersAwareFunction: function(args, cb, headers) {
		                  return {
		                      name: headers.Token
		                  };
		              },
		 
		              // You can also inspect the original `req` 
		              reallyDetailedFunction: function(args, cb, headers, req) {
		                  console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
		                  return {
		                      name: headers.Token
		                  };
		              }
		          }
		      }
		  };
		 
		  var xml = GLOBAL.req.fs.readFileSync('inspirenode.wsdl', 'utf8'),
		      server = GLOBAL.req.http.createServer(function(request,response) {
		          response.end("404: Not Found: " + request.url);
		      });
		 
		  server.listen(8000);
		  soap.listen(server, '/wsdl', myService, xml);
}
module.exports = interface_applicamp;