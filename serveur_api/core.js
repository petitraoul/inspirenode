/**
 * New node file
 */
var core=function(){
	this.timer=null;
	var self=this;
	this.charge_all=function(callback){
		var self=this;
		GLOBAL.req.async.series([
                		   /*chargement des data*/
                 		  function(callbackt){ 
        						self.charge_dbmodel(callbackt);
        					},
            			  function(callbackco){  
        						try {
	          				    	GLOBAL.req.constante.charge_constantes(callbackco);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement constantes',error:e},'startstop');
								}
          				    }, 
        				  function(callbackm){ 
        						try {
									GLOBAL.req.mode.charge_modes(callbackm);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement modes',error:e},'startstop');
								}
        						
          					},
          				  function(callbackty){ 
        						try {
									GLOBAL.req.type.charge_types(callbackty);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement types',error:e},'startstop');
								}
        						
          					},
        				  function(callbackt){ 
        						try {
									GLOBAL.req.tag.charge_tags(callbackt)
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement tags',error:e},'startstop');
								}
        						;
          					},
                  		  function(callbackt2){ 
        						try {
									GLOBAL.req.tag.charge_parents_tags(callbackt2)
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement parents_tags',error:e},'startstop');
								}
          						;
          					},
          			      function(callbackc){  
        						try {
									GLOBAL.req.categorie.charge_categories(callbackc);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement categories',error:e},'startstop');
								}
          						
          				    },           			  
          				  function(callbackco){   
        						try {
									GLOBAL.req.consigne.charge_consignes(callbackco);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement consignes',error:e},'startstop');
								}
          				    	
          				    },
          				  function(callbackb){ 
        						try {
									GLOBAL.req.box.charge_boxs(callbackb);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement boxs',error:e},'startstop');
								}
          				    	
	          				},
          				  function(callbackp){   
        						try {
									GLOBAL.req.peripherique.charge_peripheriques(callbackp);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques',error:e},'startstop');
								}
	          					
	          					
	          				},
	          			  function(callbackpc){ 
        						try {
        							GLOBAL.req.periph_chauffage.charge_peripheriques_chauffage(callbackpc);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques_chauffage',error:e},'startstop');
								}
	          					
	          				},	          			  
	          			  function(callbackpa){  
        						try {
									GLOBAL.req.periph_alarme.charge_peripheriques_alarme(callbackpa);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques_alarme',error:e},'startstop');
								}
	          					
	          				},	          			  
	          			  function(callbackba){  
        						try {
									GLOBAL.req.periph_batterie.charge_peripheriques_batterie(callbackba);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques_batterie',error:e},'startstop');
								}
	          					
	          				},
          				  function(callbackpd){  
          				  	//callbackpd();
        						try {
									GLOBAL.req.periph_deporte.charge_peripheriques_deporte(callbackpd);
								} catch (e) {
									logger('ERROR',{msg:'probleme chargement peripheriques_deporte',error:e},'startstop');
								}
	          					
	          				}/*,
	          			  function(callbackbe){    
	          					self.boucle_chargeetatbox(callbackbe);
	          				}*/]

          		, function(err) { //This is the final callback
						//console.log('fin chargement core');
                      GLOBAL.obj.app.serveur.emit('core_charge_all');
                      GLOBAL.req.mode.get_etat(function(arg,arg2){
                    	  var i=1;
                      })
                      GLOBAL.req.type.get_etat(function(arg,arg2){
                    	  var i=1;
                      })
                      callback();
                  });
	}
	this.findinperiphs=function(uuid){
		var periphe=GLOBAL.obj.app.core.findobj(uuid,'peripheriques');
		if (!periphe) {
			periphe=GLOBAL.obj.app.core.findobj(uuid,'peripheriquesdeportes');
		} 
		if (!periphe) {
			periphe=GLOBAL.obj.app.core.findobj(uuid,'peripheriques_chauffage');
		} 		
		if (!periphe) {
			periphe=GLOBAL.obj.app.core.findobj(uuid,'peripheriques_alarme');
		} 
		if (!periphe) {
			periphe=GLOBAL.obj.app.core.findobj(uuid,'peripheriques_batterie');
		} 
		return periphe;
	}
	
	this.findobj=function(id_or_name,type){
		if (GLOBAL.obj[type]){
			for (var i in GLOBAL.obj[type]){
				if (GLOBAL.obj[type][i].id && GLOBAL.obj[type][i].id==id_or_name) {
					return GLOBAL.obj[type][i];
				}
			}
			for (var i in GLOBAL.obj[type]){
				if (GLOBAL.obj[type][i].uuid && GLOBAL.obj[type][i].uuid==id_or_name) {
					return GLOBAL.obj[type][i];
				}
			}
			for (var i in GLOBAL.obj[type]){
				if (GLOBAL.obj[type][i].name && GLOBAL.obj[type][i].name==id_or_name) {
					return GLOBAL.obj[type][i];
				}
				if (GLOBAL.obj[type][i].nom && GLOBAL.obj[type][i].nom==id_or_name) {
					return GLOBAL.obj[type][i];
				}
			}
			for (var i in GLOBAL.obj[type]){
				if (GLOBAL.obj[type][i].code && GLOBAL.obj[type][i].code==id_or_name) {
					return GLOBAL.obj[type][i];
				}
			}
		} else if (GLOBAL[type]) {
			for (var i in GLOBAL[type]){
				if (GLOBAL[type][i].id && GLOBAL[type][i].id==id_or_name) {
					return GLOBAL[type][i];
				}
			}
			for (var i in GLOBAL[type]){
				if (GLOBAL[type][i].uuid && GLOBAL[type][i].uuid==id_or_name) {
					return GLOBAL[type][i];
				}
			}
			for (var i in GLOBAL[type]){
				if (GLOBAL[type][i].name && GLOBAL[type][i].name==id_or_name) {
					return GLOBAL[type][i];
				}
				if (GLOBAL[type][i].nom && GLOBAL[type][i].nom==id_or_name) {
					return GLOBAL[type][i];
				}
			}
		}
		return null;
	}

	
	this.charge_dbmodel=function(callback){
			GLOBAL.obj.tables=GLOBAL.req.dbmodel.tables;
			callback();
	}

	this.majdb= function(variables,callback,sansReload){
		var sep="";
		var reponse={};
		switch (variables.action) {
			
			case 'save':	
				
				function after_id_tableprinc(table_model,id,reponse,variables,obj,callbackr,sansReload){
				if (table_model.tables_compl){
					
					var id1=id;
					 GLOBAL.req.async.map(Object.keys(table_model.tables_compl),function(tc,callbacke){
						 	var tabcomp=table_model.tables_compl[tc];
							var sqldel="delete from "+tabcomp.name+" where id_"+table_model.name+"="+id1+";";
							//console.log(sqldel);
							var id2=id1;
							GLOBAL.obj.app.db.sqltrans(sqldel,function(){
								var id3=id2;
								try {
									GLOBAL.req.async.map(Object.keys(obj[tabcomp.soustable_name]),function(vtc,callbacked){
										var sobj=obj[tabcomp.soustable_name][vtc];
										var sqlins="insert into "+tabcomp.name+" (id_"+table_model.name+",id_"+tabcomp.soustable_name+") values ('"+id3+"','"+sobj.id+"');";
										//console.log(sqlins);
										GLOBAL.obj.app.db.sqltrans(sqlins,function(){callbacked()});
									},function(err){
										callbacke();
							  		}	);
								} catch (e) {
									console.log(e);
									callbacke();
								}
			
							
								
							});
							
						}
				  		,function(err){
				  			if (sansReload) {
								reponse.element=obj;
								if (callbackr) callbackr(variables,reponse);
				  			} else {
								GLOBAL.obj.app.core.charge_all(function(){
									//res.end();
									reponse.element=obj;
									if (callbackr) callbackr(variables,reponse);
								});					  				
				  			}

				  		});
				} else {
					if (sansReload) {
						reponse.element=obj;
						if (callbackr) callbackr(variables,reponse);
		  			} else {
						GLOBAL.obj.app.core.charge_all(function(){
							//res.end();
							reponse.element=obj;
							if (callbackr) callbackr(variables,reponse);
						});		
		  			}
					
				}

				
			}
				
				
				var table=variables.element;
				var obj=(variables.data);
				var id=obj.id;
				var id_exists=false;
				var table_model=GLOBAL.obj.app.core.findobj(table,'tables');
				if (!obj.uuid || obj.uuid==""){
					obj.uuid=generateUUID();
				}
				GLOBAL.req.async.series([ 
				                          function(callbackb){
				                        	if (isRealValue(id))  {
					              				var sql='Select * from '+table+' where id =\''+id+'\';';
					            				GLOBAL.obj.app.db.sqlorder(sql,
					            					function(rows){
					            						if (isRealValue(id) && rows.length>0) {
					            							id_exists=true;
					            							
					            						}
					            						callbackb();
					            				});				                        		
				                        	} else {
				                        		callbackb();
				                        	}

				                          },
				                          function(callbacka) {
				                        	  if (id && id_exists) {
				                        		  id_exists=false;
				          						var sql="update "+table+" set "
				          						var cols="";
				          						var valeurs_array=[];
				          						var sep="";
				          							for (var c in table_model.colonnes){
				          								var col=table_model.colonnes[c];
				          								if (col.name!='id' && isRealValue(obj[col.name])){
				          									cols+=sep+col.name+"=?";
				          									sep=",";
				          									valeurs_array.push(obj[col.name]);
				          								}
				          							}
				          						sql+=cols+" where id='"+id+"';";
				          						//console.log(sql);
				          						//res.writeHead(200, {'Content-Type': 'text/plain',
				          						//	 'Access-Control-Allow-Origin': '*'});
				          						reponse.msg="Mise à jour réalisée";
				          						//callback(variables,reponse);
				          						//res.write(JSON.stringify(reponse));		
				          						var id2=id;
				          						GLOBAL.obj.app.db.sqltrans(sql,function(){
				          							//console.log('after_id_tableprinc id='+id)
				          							after_id_tableprinc(table_model,id2,reponse,variables,obj,callbacka,sansReload);
				          						},valeurs_array);
				          						
				          						
				          					} else {
				          						id_exists=false;
					           					var sql="insert into "+table+" ("
					    						var cols="";
					    						var vals="";
					    						var valeurs_array=[];
					    						var sep="";
					    							for (var c in table_model.colonnes){
					    								var col=table_model.colonnes[c];
					    								if (col.name!='id' ){
					    									cols+=sep+col.name;
					    									vals+=sep+"?"
					    									valeurs_array.push(obj[col.name]);
					    									sep=",";
					    								}
					    							}
					    						sql+=cols+") values ("+vals+");";
					    						//console.log(sql);
					    						GLOBAL.obj.app.db.sqltrans(sql,function(rowid){
					    							//res.writeHead(200, {'Content-Type': 'text/plain',
					    							//	 'Access-Control-Allow-Origin': '*'});
					    							//reponse.page='back'
					    							var sql1=sql;
					    							id=rowid;
					    							//console.log('==id='+id);
				   									obj.id=id;
				   									console.log('after_id_tableprinc id='+id+'  '+sql1)
					    							reponse.msg="Ajout réalisé";
					    							//callback(variables,reponse);
					    							//res.write(JSON.stringify(reponse));			
					    							after_id_tableprinc(table_model,id,reponse,variables,obj,callbacka,sansReload);
					    							
					    						},valeurs_array);
				          						                          

				          					}
				                        	  
				                        	  
				                          }],
				                          function(err){
											if (callback) callback(variables,reponse);
										});
				

				break;
			case 'delete':
				var table=variables.element;
				var table_model=GLOBAL.obj.app.core.findobj(table,'tables')
				var obj=(variables.data);
				var id=obj.id;
				//console.log('delete '+table+ ' where id='+id);
				if (id) {
					var sql="delete from "+table;
					sql+=" where id='"+id+"';";
					//console.log(sql);
					GLOBAL.obj.app.db.sqltrans(sql);
					//res.writeHead(200, {'Content-Type': 'text/plain',
					//	 'Access-Control-Allow-Origin': '*'});
					if (table_model.tables_compl){
						for (var tc in table_model.tables_compl){
							var tabcomp=table_model.tables_compl[tc];
							var sqldel="delete from "+tabcomp.name+" where id_"+table_model.name+"="+id+";";
							console.log(sqldel);
							GLOBAL.obj.app.db.sqltrans(sqldel);
						}
					}
					reponse.msg="Suppression réalisée";
					reponse.page='back'
					reponse.element=obj
					//res.write(JSON.stringify(reponse));
				}
				GLOBAL.obj.app.core.charge_all(function(){
					if (callback) callback(variables,reponse);
					//res.end();
				});
				break;
		default:
			break;
		}
		
		
	}

	/*this.boucle_chargeetatbox=function(callback){
		var self=this;		
		
		if (!this.timer) {
			//self.timer=setInterval(function(){GLOBAL.req.box.update_etat_boxs(function(){});}, 15000);
			GLOBAL.obj.app.serveur.on('box.update_etat_box',function(box){
				GLOBAL.req.peripherique.update_etat_periph_of_box(box,function(){
					GLOBAL.req.periph_chauffage.update_etat_periphchauff(function(){});
					GLOBAL.req.periph_alarme.update_etat_periphalarme(function(){});
				});
			});
		}
		GLOBAL.req.box.update_etat_boxs(callback);
	}*/
	
	
	this.set_last_etat=function(obj,new_etat,originsetetat,user){
		
		/*if (obj.id=='tag_27') {
			console.error(originsetetat,obj.id,obj.nom,new_etat.etat);
		}*/
		if (user) console.log(user.user,JSON.stringify(new_etat));
		var changed=false;
		var added=false;
		var changed_etat=false;
		var added_etat=false;
		var lastsetetatname='maj_etat_general';
		if (originsetetat) {
			lastsetetatname=originsetetat;
		}
		var jlast_etat="";
		var jnew_etat="";
		var etat_avant;
		try {
			if (!obj.last_etat) {
				added=true;
				added_etat=true;
			} else {
				jlast_etat=JSON.stringify(obj.last_etat.expression);
				jnew_etat=JSON.stringify(new_etat);
				if (jlast_etat!=jnew_etat) {
					changed=true;
				}
				if (obj.last_etat.expression && obj.last_etat.expression.etat!=new_etat.etat) {
					changed_etat=true;
					etat_avant=obj.last_etat.expression.etat;
					/*if (obj.id=='tag_27') {
						console.error(originsetetat,obj.id,obj.nom,'lastetat:',obj.last_etat.expression.etat);
					}*/
				}
				
				
			}
		} catch (e) {
			logger('ERROR',{msg:'Probleme en changement etat periph',nom:obj.nom,id:obj.id,lastsetetatname:lastsetetatname,last_etat:obj.last_etat,new_etat:new_etat,error:e},'changement_etat');
			
		}

		//console.log(obj.name + "__"+obj.constructor.name);
		if (changed || added){
			
			var typeobj=obj.name;
			if (!typeobj) typeobj=obj.constructor.name;
			
			if (changed) {
				logger('INFO',{msg:'Changement etat periph',nom:obj.nom,id:obj.id,lastsetetatname:lastsetetatname,last_etat:obj.last_etat,new_etat:new_etat,},'changement_etat');
				
				if (obj.categorie && obj.categorie.nom){
					var cat_nom = obj.categorie.nom;
					cat_nom = cat_nom.replace("/", "_");
					logger('INFO',{msg:'Changement etat periph',nom:obj.nom,id:obj.id,last_etat:obj.last_etat,new_etat:new_etat,},'changement_etat_'+cat_nom);
				}
				GLOBAL.obj.app.serveur.emit(typeobj+'.last_etat.changed',obj,obj.last_etat,new_etat,user);
				
				obj.last_etat.expression=new_etat;
				obj.last_etat.TimeOfetat=new Date().getTime();	
				obj.last_etat.TimeOfetat_str=req.moment().format('DD/MM/YY HH:mm:ss');	
				
				if (lastsetetatname && changed_etat) {
					//console.error(originsetetat,obj.id,obj.nom,etat_avant,new_etat.etat,'-----changed etat');
					/*if (obj.id=='tag_27') {
						console.trace(originsetetat,obj.id,obj.nom,etat_avant,new_etat.etat,'-----changed etat');
						console.log(JSON.stringify(obj.box.last_etat['id_tag_27']));
						console.log(JSON.stringify(obj.last_etat.expression));
					}		*/			
					if (!obj.last_etat[lastsetetatname]) obj.last_etat[lastsetetatname]={};
					
					obj.last_etat[lastsetetatname].TimeOfetat=new Date().getTime();	
					obj.last_etat[lastsetetatname].TimeOfetat_str=req.moment().format('DD/MM/YY HH:mm:ss');
					obj.last_etat[lastsetetatname].etat=new_etat.etat;
					obj.last_etat[lastsetetatname].etat_avant=etat_avant;

				} 
				
				//console.log("     "+jlast_etat);
				//console.log("     "+jnew_etat);				
			} else if (added){
				logger('INFO',{msg:'Changement etat periph',nom:obj.nom,id:obj.id,lastsetetatname:lastsetetatname,last_etat:obj.last_etat,new_etat:new_etat,},'changement_etat');
				
				if (obj.categorie && obj.categorie.nom) {
					var cat_nom = obj.categorie.nom;
					cat_nom = cat_nom.replace("/", "_");
					logger('INFO',{msg:'Changement etat periph',nom:obj.nom,id:obj.id,last_etat:obj.last_etat,new_etat:new_etat,},'changement_etat_'+cat_nom);
				}
				GLOBAL.obj.app.serveur.emit(typeobj+'.last_etat.added',obj,obj.last_etat,new_etat,user);
				obj.last_etat={};
				obj.last_etat.expression=new_etat;
				obj.last_etat.TimeOfetat=new Date().getTime();	
				obj.last_etat.TimeOfetat_str=req.moment().format('DD/MM/YY HH:mm:ss');	
				
				if (lastsetetatname && added_etat) {
					if (!obj.last_etat[lastsetetatname]) obj.last_etat[lastsetetatname]={};
					obj.last_etat[lastsetetatname].TimeOfetat=new Date().getTime();	
					obj.last_etat[lastsetetatname].TimeOfetat_str=req.moment().format('DD/MM/YY HH:mm:ss');
					obj.last_etat[lastsetetatname].etat=new_etat.etat;
				} 
				//console.log("     "+jnew_etat);	
			}
			
			//obj.last_etat=new_etat;
		}
		
	}
	
	this.clientactif=function(req){
		//var remoteip=req.connection.remoteAddress;
		//if (!this.clients) {
		///	this.clients={};
		//}
		
		//this.clients['client_'+remoteip]=(new Date).getTime();
		//console.log((new Date),(new Date).getTime(),remoteip);
	}
	
}	

generateUUID = function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

isRealValue = function isRealValue(obj){
	 var res=false;
	 if (typeof obj != "null" && typeof obj!= "undefined") res=true;
	 return res;
	}

core.prototype= new GLOBAL.req.events.EventEmitter();
module.exports = core;