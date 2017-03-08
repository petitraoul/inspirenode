/**
 * Historisation dans les tables historique_heure, historique_jour, historique_mois, historique_an
 */ 
 
var historise_etat_fixe={id:98,nom:"historise_etat_fixe",etat:"OFF",lastrun:null};
var timer=null;
historise_etat_fixe.fileattenteetat=[];
historise_etat_fixe.busy=false;

historise_etat_fixe.start=function(){
	if (historise_etat_fixe.etat=='OFF' ) {
		historise_etat_fixe.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		/*Execution toutes les  60 secondes*/
		timer=setInterval(function(){
				historise_etat_fixe.lastrun = req.moment().format('YYYY-MM-DD HH:mm:ss');
				Histo();
			}, 60000);
	}
}

historise_etat_fixe.stop=function(){
	if (historise_etat_fixe.etat=='ON') {
		historise_etat_fixe.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		clearInterval(timer);
	}

}

function Histo(){
	var timestamp=req.moment().format('YYYY-MM-DD HH:mm:ss');
	var histo_heure=(req.moment().format('mm'));
	var histo_jour=(req.moment().format('HH:mm'));
	var histo_mois=(req.moment().format('DD HH:mm'));
	var histo_an=(req.moment().format('MM-DD HH:mm'));													
	var fin_mois = new Date(req.moment().toDate().getYear(),req.moment().toDate().getMonth()+1,0);
	var jour_fin_mois = fin_mois.getDate();
	
	
	var minute=(req.moment().format('mm'));
	var heure=(req.moment().format('HH'));
	var jour=(req.moment().format('DD'));
	var mois=(req.moment().format('MM'));
	var annee=(req.moment().format('YYYY'));
			
	var okinsert=false;
	logger('DEBUG',{msg:'Histo heure : '+timestamp},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG',{msg:'Histo test heure : '+histo_heure},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG',{msg:'Histo test jour : '+histo_jour},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG',{msg:'Histo test mois : '+histo_mois},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG',{msg:'Histo test an : '+histo_an},'automation_'+historise_etat_fixe.nom);
	logger('DEBUG','Jour fin de mois: '+jour_fin_mois,'automation_'+historise_etat_fixe.nom);
	if (histo_heure=='59'){		
		logger('DEBUG',{msg:'D�but calcul histo heure'},'automation_'+historise_etat_fixe.nom);
		//Calcul des min max et moy pour chaque expression des p�riph�rique de l'heure en cours
		//retourne une seule ligne par p�riph�rique
		var date_sql = req.moment().format('YYYY-MM-DD HH');
		var sql="select max(p.id) id, p.uuid, max(expr1) expr1_max, min(expr1) expr1_min, round(sum(expr1)/count(*),2) expr1_moy "
								+", max(expr2) expr2_max, min(expr2) expr2_min, round(sum(expr2)/count(*),2) expr2_moy "
								+", max(expr3) expr3_max, min(expr3) expr3_min, round(sum(expr3)/count(*),2) expr3_moy "
								+", max(expr4) expr4_max, min(expr4) expr4_min, round(sum(expr4)/count(*),2) expr4_moy "
								+", max(expr5) expr5_max, min(expr5) expr5_min, round(sum(expr5)/count(*),2) expr5_moy "
								+", max(expr6) expr6_max, min(expr6) expr6_min, round(sum(expr6)/count(*),2) expr6_moy "
								+", max(expr7) expr7_max, min(expr7) expr7_min, round(sum(expr7)/count(*),2) expr7_moy "
								+", max(etat) etat_max, min(etat) etat_min, round(sum(etat)/count(*),2) etat_moy "
								+"from "
								+" peripherique p left outer join (select * from historique h where "
								+" strftime('%Y-%m-%d %H',h.timestamp) = '"+date_sql+"' order by id desc) f on p.uuid = f.uuid "
								+"group by p.uuid";
		GLOBAL.obj.app.db.sqlorder(sql,
	            function(rows){
	                if (rows) {
						logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+historise_etat_fixe.nom);

	                	for (var l in rows){
							
							//histo heure							
							var periph=obj.app.core.findobj(rows[l].id,'peripheriques');
							var uuid=periph.uuid;
							
							var ordersql_heure= 'insert into historique_heure (';			
							var colonnessql_heure="timestamp, uuid, etat, expr1, expr2, expr3, expr4, expr5, expr6, expr7 "
								+", etat_unit, expr1_unit , expr2_unit, expr3_unit ,expr4_unit , expr5_unit, expr6_unit, expr7_unit "
								+", expr1_max, expr1_min, expr1_moy "
								+", expr2_max, expr2_min, expr2_moy "
								+", expr3_max, expr3_min, expr3_moy "
								+", expr4_max, expr4_min, expr4_moy "
								+", expr5_max, expr5_min, expr5_moy "
								+", expr6_max, expr6_min, expr6_moy "
								+", expr7_max, expr7_min, expr7_moy "
								+", etat_max, etat_min, etat_moy ";
							var datasql_heure="'"+timestamp+"','"+uuid+"','"+periph.last_etat.expression.etat+"','"+periph.last_etat.expression.expr1+"','"+periph.last_etat.expression.expr2+"','"+periph.last_etat.expression.expr3+"','"+periph.last_etat.expression.expr4+"','"+periph.last_etat.expression.expr5+"','"+periph.last_etat.expression.expr6+"','"+periph.last_etat.expression.expr7;
								datasql_heure+="','"+periph.last_etat.expression.etat_unit+"','"+periph.last_etat.expression.expr1_unit+"','"+periph.last_etat.expression.expr2_unit+"','"+periph.last_etat.expression.expr3_unit+"','"+periph.last_etat.expression.expr4_unit+"','"+periph.last_etat.expression.expr5_unit+"','"+periph.last_etat.expression.expr6_unit+"','"+periph.last_etat.expression.expr7_unit;
								datasql_heure+="','"+rows[l].expr1_max+"','"+rows[l].expr1_min+"','"+rows[l].expr1_moy;
								datasql_heure+="','"+rows[l].expr2_max+"','"+rows[l].expr2_min+"','"+rows[l].expr2_moy;
								datasql_heure+="','"+rows[l].expr3_max+"','"+rows[l].expr3_min+"','"+rows[l].expr3_moy;
								datasql_heure+="','"+rows[l].expr4_max+"','"+rows[l].expr4_min+"','"+rows[l].expr4_moy;
								datasql_heure+="','"+rows[l].expr5_max+"','"+rows[l].expr5_min+"','"+rows[l].expr5_moy;
								datasql_heure+="','"+rows[l].expr6_max+"','"+rows[l].expr6_min+"','"+rows[l].expr6_moy;
								datasql_heure+="','"+rows[l].expr7_max+"','"+rows[l].expr7_min+"','"+rows[l].expr7_moy;	
								datasql_heure+="','"+rows[l].etat_max+"','"+rows[l].etat_min+"','"+rows[l].etat_moy;										
								datasql_heure+="'";
							ordersql_heure+=colonnessql_heure+") values ("+datasql_heure+");";		

							historise_etat_fixe.fileattenteetat.push(ordersql_heure);	
						}
						GLOBAL.obj.app.db.sqltrans(historise_etat_fixe.fileattenteetat,function(nborder){
							historise_etat_fixe.fileattenteetat.splice(0,nborder);
							logger('INFO','historisation de '+nborder+' p�riph�riques dans historique_heure','automation_'+historise_etat_fixe.nom);
							historise_etat_fixe.fileattenteetat=[];
							logger('DEBUG',{msg:'Fin calcul histo heure'},'automation_'+historise_etat_fixe.nom);
							if (histo_jour=='23:59'){
								logger('DEBUG',{msg:'D�but calcul histo jour'},'automation_'+historise_etat_fixe.nom);
////-------------------
								//Calcul des min max et moy pour chaque expression des p�riph�rique du jour en cours
								//retourne une seule ligne par p�riph�rique
								var date_sql = req.moment().format('YYYY-MM-DD');
								var sql="select max(p.id) id, p.uuid, max(expr1) expr1_max, min(expr1) expr1_min, round(sum(expr1)/count(*),2) expr1_moy "
														+", max(expr2) expr2_max, min(expr2) expr2_min, round(sum(expr2)/count(*),2) expr2_moy "
														+", max(expr3) expr3_max, min(expr3) expr3_min, round(sum(expr3)/count(*),2) expr3_moy "
														+", max(expr4) expr4_max, min(expr4) expr4_min, round(sum(expr4)/count(*),2) expr4_moy "
														+", max(expr5) expr5_max, min(expr5) expr5_min, round(sum(expr5)/count(*),2) expr5_moy "
														+", max(expr6) expr6_max, min(expr6) expr6_min, round(sum(expr6)/count(*),2) expr6_moy "
														+", max(expr7) expr7_max, min(expr7) expr7_min, round(sum(expr7)/count(*),2) expr7_moy "
														+", max(etat) etat_max, min(etat) etat_min, round(sum(etat)/count(*),2) etat_moy "
														+"from "
														+" peripherique p left outer join (select * from historique_heure h where "
														+" strftime('%Y-%m-%d',h.timestamp) = '"+date_sql+"' order by id desc) f on p.uuid = f.uuid "
														+"group by p.uuid";
								GLOBAL.obj.app.db.sqlorder(sql,
										function(rows){
											if (rows) {
												logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+historise_etat_fixe.nom);

												for (var l in rows){
													
													//histo jour							
													var periph=obj.app.core.findobj(rows[l].id,'peripheriques');
													var uuid=periph.uuid;
													
													var ordersql_jour= 'insert into historique_jour (';			
													var colonnessql_jour="timestamp, uuid, etat, expr1, expr2, expr3, expr4, expr5, expr6, expr7 "
														+", etat_unit, expr1_unit , expr2_unit, expr3_unit ,expr4_unit , expr5_unit, expr6_unit, expr7_unit "
														+", expr1_max, expr1_min, expr1_moy "
														+", expr2_max, expr2_min, expr2_moy "
														+", expr3_max, expr3_min, expr3_moy "
														+", expr4_max, expr4_min, expr4_moy "
														+", expr5_max, expr5_min, expr5_moy "
														+", expr6_max, expr6_min, expr6_moy "
														+", expr7_max, expr7_min, expr7_moy "
														+", etat_max, etat_min, etat_moy ";
													var datasql_jour="'"+timestamp+"','"+uuid+"','"+periph.last_etat.expression.etat+"','"+periph.last_etat.expression.expr1+"','"+periph.last_etat.expression.expr2+"','"+periph.last_etat.expression.expr3+"','"+periph.last_etat.expression.expr4+"','"+periph.last_etat.expression.expr5+"','"+periph.last_etat.expression.expr6+"','"+periph.last_etat.expression.expr7;
														datasql_jour+="','"+periph.last_etat.expression.etat_unit+"','"+periph.last_etat.expression.expr1_unit+"','"+periph.last_etat.expression.expr2_unit+"','"+periph.last_etat.expression.expr3_unit+"','"+periph.last_etat.expression.expr4_unit+"','"+periph.last_etat.expression.expr5_unit+"','"+periph.last_etat.expression.expr6_unit+"','"+periph.last_etat.expression.expr7_unit;
														datasql_jour+="','"+rows[l].expr1_max+"','"+rows[l].expr1_min+"','"+rows[l].expr1_moy;
														datasql_jour+="','"+rows[l].expr2_max+"','"+rows[l].expr2_min+"','"+rows[l].expr2_moy;
														datasql_jour+="','"+rows[l].expr3_max+"','"+rows[l].expr3_min+"','"+rows[l].expr3_moy;
														datasql_jour+="','"+rows[l].expr4_max+"','"+rows[l].expr4_min+"','"+rows[l].expr4_moy;
														datasql_jour+="','"+rows[l].expr5_max+"','"+rows[l].expr5_min+"','"+rows[l].expr5_moy;
														datasql_jour+="','"+rows[l].expr6_max+"','"+rows[l].expr6_min+"','"+rows[l].expr6_moy;
														datasql_jour+="','"+rows[l].expr7_max+"','"+rows[l].expr7_min+"','"+rows[l].expr7_moy;	
														datasql_jour+="','"+rows[l].etat_max+"','"+rows[l].etat_min+"','"+rows[l].etat_moy;										
														datasql_jour+="'";
													ordersql_jour+=colonnessql_jour+") values ("+datasql_jour+");";		

													historise_etat_fixe.fileattenteetat.push(ordersql_jour);	
												}
												GLOBAL.obj.app.db.sqltrans(historise_etat_fixe.fileattenteetat,function(nborder){
													historise_etat_fixe.fileattenteetat.splice(0,nborder);
													logger('INFO','historisation de '+nborder+' p�riph�riques dans historique_jour','automation_'+historise_etat_fixe.nom);
													logger('DEBUG',{msg:'Fin calcul histo jour'},'automation_'+historise_etat_fixe.nom);
																										
													historise_etat_fixe.fileattenteetat=[];
													if (histo_mois== jour_fin_mois+' 23:59'){
														logger('DEBUG',{msg:'D�but calcul histo mois'},'automation_'+historise_etat_fixe.nom);
////-------------------	
														//Calcul des min max et moy pour chaque expression des p�riph�rique du mois en cours
														//retourne une seule ligne par p�riph�rique
														var date_sql = req.moment().format('YYYY-MM');
														var sql="select max(p.id) id, p.uuid, max(expr1) expr1_max, min(expr1) expr1_min, round(sum(expr1)/count(*),2) expr1_moy "
																				+", max(expr2) expr2_max, min(expr2) expr2_min, round(sum(expr2)/count(*),2) expr2_moy "
																				+", max(expr3) expr3_max, min(expr3) expr3_min, round(sum(expr3)/count(*),2) expr3_moy "
																				+", max(expr4) expr4_max, min(expr4) expr4_min, round(sum(expr4)/count(*),2) expr4_moy "
																				+", max(expr5) expr5_max, min(expr5) expr5_min, round(sum(expr5)/count(*),2) expr5_moy "
																				+", max(expr6) expr6_max, min(expr6) expr6_min, round(sum(expr6)/count(*),2) expr6_moy "
																				+", max(expr7) expr7_max, min(expr7) expr7_min, round(sum(expr7)/count(*),2) expr7_moy "
																				+", max(etat) etat_max, min(etat) etat_min, round(sum(etat)/count(*),2) etat_moy "
																				+"from "
																				+" peripherique p left outer join (select * from historique_jour h where "
																				+" strftime('%Y-%m',h.timestamp) = '"+date_sql+"' order by id desc) f on p.uuid = f.uuid "
																				+"group by p.uuid";
														GLOBAL.obj.app.db.sqlorder(sql,
																function(rows){
																	if (rows) {
																		logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+historise_etat_fixe.nom);

																		for (var l in rows){
																			
																			//histo mois							
																			var periph=obj.app.core.findobj(rows[l].id,'peripheriques');
																			var uuid=periph.uuid;
																			
																			var ordersql_mois= 'insert into historique_mois (';			
																			var colonnessql_mois="timestamp, uuid, etat, expr1, expr2, expr3, expr4, expr5, expr6, expr7 "
																				+", etat_unit, expr1_unit , expr2_unit, expr3_unit ,expr4_unit , expr5_unit, expr6_unit, expr7_unit "
																				+", expr1_max, expr1_min, expr1_moy "
																				+", expr2_max, expr2_min, expr2_moy "
																				+", expr3_max, expr3_min, expr3_moy "
																				+", expr4_max, expr4_min, expr4_moy "
																				+", expr5_max, expr5_min, expr5_moy "
																				+", expr6_max, expr6_min, expr6_moy "
																				+", expr7_max, expr7_min, expr7_moy "
																				+", etat_max, etat_min, etat_moy ";
																			var datasql_mois="'"+timestamp+"','"+uuid+"','"+periph.last_etat.expression.etat+"','"+periph.last_etat.expression.expr1+"','"+periph.last_etat.expression.expr2+"','"+periph.last_etat.expression.expr3+"','"+periph.last_etat.expression.expr4+"','"+periph.last_etat.expression.expr5+"','"+periph.last_etat.expression.expr6+"','"+periph.last_etat.expression.expr7;
																				datasql_mois+="','"+periph.last_etat.expression.etat_unit+"','"+periph.last_etat.expression.expr1_unit+"','"+periph.last_etat.expression.expr2_unit+"','"+periph.last_etat.expression.expr3_unit+"','"+periph.last_etat.expression.expr4_unit+"','"+periph.last_etat.expression.expr5_unit+"','"+periph.last_etat.expression.expr6_unit+"','"+periph.last_etat.expression.expr7_unit;
																				datasql_mois+="','"+rows[l].expr1_max+"','"+rows[l].expr1_min+"','"+rows[l].expr1_moy;
																				datasql_mois+="','"+rows[l].expr2_max+"','"+rows[l].expr2_min+"','"+rows[l].expr2_moy;
																				datasql_mois+="','"+rows[l].expr3_max+"','"+rows[l].expr3_min+"','"+rows[l].expr3_moy;
																				datasql_mois+="','"+rows[l].expr4_max+"','"+rows[l].expr4_min+"','"+rows[l].expr4_moy;
																				datasql_mois+="','"+rows[l].expr5_max+"','"+rows[l].expr5_min+"','"+rows[l].expr5_moy;
																				datasql_mois+="','"+rows[l].expr6_max+"','"+rows[l].expr6_min+"','"+rows[l].expr6_moy;
																				datasql_mois+="','"+rows[l].expr7_max+"','"+rows[l].expr7_min+"','"+rows[l].expr7_moy;	
																				datasql_mois+="','"+rows[l].etat_max+"','"+rows[l].etat_min+"','"+rows[l].etat_moy;										
																				datasql_mois+="'";
																			ordersql_mois+=colonnessql_mois+") values ("+datasql_mois+");";		

																			historise_etat_fixe.fileattenteetat.push(ordersql_mois);	
																		}
																		GLOBAL.obj.app.db.sqltrans(historise_etat_fixe.fileattenteetat,function(nborder){
																			historise_etat_fixe.fileattenteetat.splice(0,nborder);
																			logger('INFO','historisation de '+nborder+' p�riph�riques dans historique_mois','automation_'+historise_etat_fixe.nom);
																			
																			logger('DEBUG',{msg:'Fin calcul histo mois'},'automation_'+historise_etat_fixe.nom);
																			historise_etat_fixe.fileattenteetat=[];
																			if (histo_an=='12-31 23:59'){
																				logger('DEBUG',{msg:'D�but calcul histo an'},'automation_'+historise_etat_fixe.nom);
////-------------------	
																				//Calcul des min max et moy pour chaque expression des p�riph�rique de l'ann�e en cours
																				//retourne une seule ligne par p�riph�rique
																				var date_sql = req.moment().format('YYYY');
																				var sql="select max(p.id) id, p.uuid, max(expr1) expr1_max, min(expr1) expr1_min, round(sum(expr1)/count(*),2) expr1_moy "
																										+", max(expr2) expr2_max, min(expr2) expr2_min, round(sum(expr2)/count(*),2) expr2_moy "
																										+", max(expr3) expr3_max, min(expr3) expr3_min, round(sum(expr3)/count(*),2) expr3_moy "
																										+", max(expr4) expr4_max, min(expr4) expr4_min, round(sum(expr4)/count(*),2) expr4_moy "
																										+", max(expr5) expr5_max, min(expr5) expr5_min, round(sum(expr5)/count(*),2) expr5_moy "
																										+", max(expr6) expr6_max, min(expr6) expr6_min, round(sum(expr6)/count(*),2) expr6_moy "
																										+", max(expr7) expr7_max, min(expr7) expr7_min, round(sum(expr7)/count(*),2) expr7_moy "
																										+", max(etat) etat_max, min(etat) etat_min, round(sum(etat)/count(*),2) etat_moy "
																										+"from "
																										+" peripherique p left outer join (select * from historique_mois h where "
																										+" strftime('%Y',h.timestamp) = '"+date_sql+"' order by id desc) f on p.uuid = f.uuid "
																										+"group by p.uuid";
																				GLOBAL.obj.app.db.sqlorder(sql,
																						function(rows){
																							if (rows) {
																								logger('DEBUG',{msg:'requete: '+sql,reponse:rows },'automation_'+historise_etat_fixe.nom);

																								for (var l in rows){
																									
																									//histo an							
																									var periph=obj.app.core.findobj(rows[l].id,'peripheriques');
																									var uuid=periph.uuid;
																									
																									var ordersql_an= 'insert into historique_an (';			
																									var colonnessql_an="timestamp, uuid, etat, expr1, expr2, expr3, expr4, expr5, expr6, expr7 "
																										+", etat_unit, expr1_unit , expr2_unit, expr3_unit ,expr4_unit , expr5_unit, expr6_unit, expr7_unit "
																										+", expr1_max, expr1_min, expr1_moy "
																										+", expr2_max, expr2_min, expr2_moy "
																										+", expr3_max, expr3_min, expr3_moy "
																										+", expr4_max, expr4_min, expr4_moy "
																										+", expr5_max, expr5_min, expr5_moy "
																										+", expr6_max, expr6_min, expr6_moy "
																										+", expr7_max, expr7_min, expr7_moy "
																										+", etat_max, etat_min, etat_moy ";
																									var datasql_an="'"+timestamp+"','"+uuid+"','"+periph.last_etat.expression.etat+"','"+periph.last_etat.expression.expr1+"','"+periph.last_etat.expression.expr2+"','"+periph.last_etat.expression.expr3+"','"+periph.last_etat.expression.expr4+"','"+periph.last_etat.expression.expr5+"','"+periph.last_etat.expression.expr6+"','"+periph.last_etat.expression.expr7;
																										datasql_an+="','"+periph.last_etat.expression.etat_unit+"','"+periph.last_etat.expression.expr1_unit+"','"+periph.last_etat.expression.expr2_unit+"','"+periph.last_etat.expression.expr3_unit+"','"+periph.last_etat.expression.expr4_unit+"','"+periph.last_etat.expression.expr5_unit+"','"+periph.last_etat.expression.expr6_unit+"','"+periph.last_etat.expression.expr7_unit;
																										datasql_an+="','"+rows[l].expr1_max+"','"+rows[l].expr1_min+"','"+rows[l].expr1_moy;
																										datasql_an+="','"+rows[l].expr2_max+"','"+rows[l].expr2_min+"','"+rows[l].expr2_moy;
																										datasql_an+="','"+rows[l].expr3_max+"','"+rows[l].expr3_min+"','"+rows[l].expr3_moy;
																										datasql_an+="','"+rows[l].expr4_max+"','"+rows[l].expr4_min+"','"+rows[l].expr4_moy;
																										datasql_an+="','"+rows[l].expr5_max+"','"+rows[l].expr5_min+"','"+rows[l].expr5_moy;
																										datasql_an+="','"+rows[l].expr6_max+"','"+rows[l].expr6_min+"','"+rows[l].expr6_moy;
																										datasql_an+="','"+rows[l].expr7_max+"','"+rows[l].expr7_min+"','"+rows[l].expr7_moy;	
																										datasql_an+="','"+rows[l].etat_max+"','"+rows[l].etat_min+"','"+rows[l].etat_moy;										
																										datasql_an+="'";
																									ordersql_an+=colonnessql_an+") values ("+datasql_an+");";		

																									historise_etat_fixe.fileattenteetat.push(ordersql_an);	
																								}
																								GLOBAL.obj.app.db.sqltrans(historise_etat_fixe.fileattenteetat,function(nborder){
																									historise_etat_fixe.fileattenteetat.splice(0,nborder);
																									logger('INFO','historisation de '+nborder+' p�riph�riques dans historique_an','automation_'+historise_etat_fixe.nom);
																									
																									logger('DEBUG',{msg:'Fin calcul histo an'},'automation_'+historise_etat_fixe.nom);

																								});
																							}
																						});
////-------------------															
																			}
																		});
																	}
																});
////-------------------															
													}
												});
											}
										});
////-------------------					
							}
						});
					}
				});
	}
}


module.exports = historise_etat_fixe;