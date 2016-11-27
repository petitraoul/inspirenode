/**
 * New node file
 */
var programmation_all={id:31,nom:"programmation_all",etat:"OFF",lastrun:null};
var infirstappliqueprevious=false;
var calculconsigneencours=false;
var timer=null;


programmation_all.start=function(){
	if (programmation_all.etat=='OFF') {
		programmation_all.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		//obj.app.serveur.on('consigne_chauffage.controleChauffage',function(){appliquenextconsigne();});
		obj.app.serveur.on('mode.last_etat.added',function(){appliquepreviousconsigne();});	
		obj.app.serveur.on('mode.last_etat.changed',function(){appliquepreviousconsigne();});
		obj.app.serveur.on('programmation_consigne.changed',function(){appliquepreviousconsigne();});
		//appliquepreviousconsigne();
		setTimeout(function(){
			timer=setInterval(function(){
				appliquenextconsigne();
				setTimeout(function(){appliquemodediffere();},20000);
				var datetimeactuel=new Date();
				logger('INFO',{msg:'Controle date ',datetimeactuel:datetimeactuel},'automation_'+programmation_all.nom);
				datetimeactuel.setTime( datetimeactuel.getTime() - datetimeactuel.getTimezoneOffset()*60*1000 );
				logger('INFO',{msg:'Controle date + timezone GMT+ n Heures',datetimeactuel:datetimeactuel,decalage:datetimeactuel.getTimezoneOffset()},'automation_'+programmation_all.nom);
				
			}, 60000);			
		},12000);
	}
}

programmation_all.stop=function(){
	if (programmation_all.etat=='ON') {
		programmation_all.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		//obj.app.serveur.removeListener('consigne_chauffage.controleChauffage',function(){appliquenextconsigne();});
		obj.app.serveur.removeListener('mode.last_etat.added',function(){appliquepreviousconsigne();});
		obj.app.serveur.removeListener('mode.last_etat.changed',function(){appliquepreviousconsigne();});
		obj.app.serveur.removeListener('programmation_consigne.changed',function(){appliquepreviousconsigne();});	
		clearInterval(timer);
	}
}


programmation_all.test=function (res){
	calcul_consigne(
		function(rep){
			var rep = JSON.stringify(rep);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
		});

}

function deletemodediffere(){
	var sql = 'delete from modeactivationdiff';
	GLOBAL.obj.app.db.sqltrans(sql,function(){});
}


function appliquemodediffere(){
	var sql='Select * from modeactivationdiff;';
	
	GLOBAL.obj.app.db.sqlorder(sql,
		function(rows){
			if (rows && rows[0] && rows[0].mode) {
				var diff={mode:rows[0].mode,heure:rows[0].heure,	date:rows[0].date};
				var annee=parseInt(req.moment().format('YYYY'));
				var mois=parseInt(req.moment().format('MM'));
				var jour=parseInt(req.moment().format('DD'));
				var heure=parseInt(req.moment().format('HH'));
				var minutes=parseInt(req.moment().format('mm'));
				/*date=2016-01-08&heure=6h00*/
				var datearray=parseInt(diff.date.split('-'));
				var timearray=parseInt(diff.heure.split('h'));
				
				if ((datearray[0]<annee ) ||
						(datearray[0]<=annee && datearray[1]<mois ) ||
						(datearray[0]<=annee && datearray[1]<=mois && datearray[2]<jour ) ||
						(datearray[0]<=annee && datearray[1]<=mois && datearray[2]<=jour &&	timearray[0]<heure) ||
						 (datearray[0]<=annee && datearray[1]<=mois && datearray[2]<=jour &&	timearray[0]<=heure && timearray[1]<=minutes)
						){
					GLOBAL.req.mode.set_etat(diff.mode,function(){
						
					})
				}
			}
	});

}



function appliquenextconsigne(){
	if (calculconsigneencours || programmation_all.etat=='OFF') return;
	calculconsigneencours=true;
	/*logger('INFO',{nom:programmation_consigne.nom,id:programmation_consigne.id
		,msg:'--Calcul application consigne suivante--'},'automation_'+programmation_consigne.nom);*/
	//console.log('-----appliquer la consigne suivante appliquenextconsigne')
		for (var categ_item in GLOBAL.obj.categories){
			if (GLOBAL.obj.categories[categ_item].programmable=='O'){
				//console.log('-----categorie',GLOBAL.obj.categories[categ_item].nom);
				calcul_consigne(GLOBAL.obj.categories[categ_item],function(rep2,categorie){
					//logger('DEBUG',{msg:'programmation en cours',prog:rep2},'automation_'+programmation_consigne.nom);
					//console.log('-----categorie',categorie.nom);
					var rep1=rep2;
					GLOBAL.req.mode.get_etat(function(err,mode){
						try {
								
							//console.log('-----mode',mode.nom,categorie.nom);
							var rep=rep1;
							var mode_actuel=0;
							if (mode) mode_actuel=mode.id;
							var peripheriques_chauffage=[];
							for (var c in GLOBAL.obj.peripheriques_chauffage){
								if (GLOBAL.obj.peripheriques_chauffage[c].ecriture_type!='TEMPERATURE' &&
										GLOBAL.obj.peripheriques_chauffage[c].categorie.id==categorie.id){
									peripheriques_chauffage.push(GLOBAL.obj.peripheriques_chauffage[c]);
								}
							}
							for (var c in GLOBAL.obj.peripheriquesdeportes){
								if (GLOBAL.obj.peripheriquesdeportes[c].ecriture_type!='TEMPERATURE' &&
										GLOBAL.obj.peripheriquesdeportes[c].ecriture_type!='SANS' &&
										GLOBAL.obj.peripheriquesdeportes[c].categorie.id==categorie.id){
									peripheriques_chauffage.push(GLOBAL.obj.peripheriquesdeportes[c]);
								}
							}
							for (var c in GLOBAL.obj.peripheriques){
								if (GLOBAL.obj.peripheriques[c].ecriture_type!='TEMPERATURE' &&
										GLOBAL.obj.peripheriques[c].ecriture_type!='SANS' &&
										GLOBAL.obj.peripheriques[c].categorie.id==categorie.id){
									peripheriques_chauffage.push(GLOBAL.obj.peripheriques[c]);
								}
							}
							for (var next_id in rep.next){
								if (rep.next[next_id].mode=="mode_"+mode_actuel){
									for (var c in peripheriques_chauffage){
										var tag_id=peripheriques_chauffage[c].id;
										if (peripheriques_chauffage[c].tag && peripheriques_chauffage[c].tag[0]){
											tag_id='tag_'+peripheriques_chauffage[c].tag[0].id;
										}
										if (rep.next[next_id].mode+'_'+tag_id==next_id /*&&
												peripheriques_chauffage[c].ecriture_type=='TEMPERATURECONSIGNE'*/
												&& (!rep.next[next_id].peripherique ||
														rep.next[next_id].peripherique==peripheriques_chauffage[c].id)){
											//console.log('-----key',peripheriques_chauffage[c].nom,categorie.nom,rep.next[next_id].mode+'_'+tag_id,rep.next[next_id].nextdate,rep.next[next_id].nexteventsec,rep.next[next_id].valeur);
											if (rep.next[next_id].nexteventsec<=900 && rep.next[next_id].nexteventsec>300)
												logger('INFO','Consigne va passer à '+rep.next[next_id].valeur+' dans ' + (rep.next[next_id].nexteventsec/60) + ' minutes pour '+rep.next[next_id].mode+' et '+ rep.next[next_id].tag
														,'automation_'+programmation_all.nom);
											if (rep.next[next_id].nexteventsec<=80){
												logger('INFO',{nom:programmation_all.nom,id:programmation_all.id
													,msg:'--Application nouvelle consigne--'
													,res:'---> Consigne passe à '+rep.next[next_id].valeur+' dans ' + (rep.next[next_id].nexteventsec/60) + ' minutes pour '+rep.next[next_id].mode+' et '+ rep.next[next_id].tag
													},'automation_'+programmation_all.nom);
												
												//console.log('---> Consigne passe à '+rep.next[next_id].valeur+' dans ' + (rep.next[next_id].nexteventsec/60) + ' minutes pour '+rep.next[next_id].mode+' et '+ rep.next[next_id].tag);
												//console.log('etat du periph',peripheriques_chauffage[c].nom,peripheriques_chauffage[c].last_etat);
												if ((!peripheriques_chauffage[c].last_etat) || !peripheriques_chauffage[c].last_etat.expression || !peripheriques_chauffage[c].last_etat.expression.etat || 
														(peripheriques_chauffage[c].last_etat && peripheriques_chauffage[c].last_etat.expression && peripheriques_chauffage[c].last_etat.expression.etat &&
																peripheriques_chauffage[c].last_etat.expression.etat!=rep.next[next_id].valeur)){
													
													
													var valeur=rep.next[next_id].valeur;
													var cmd='DIM';
													if (valeur=='ON') {
														valeur=peripheriques_chauffage[c].ecriture_max_value;
														cmd='ON'
													} else if (valeur=='OFF') {
														valeur=peripheriques_chauffage[c].ecriture_min_value;
														cmd='OFF'	
													}
													//console.log('---Set',peripheriques_chauffage[c].nom,cmd,valeur);
													peripheriques_chauffage[c].set_etat(cmd,valeur,
														function (c,val_next,mode_nom){
														return function(rep){
															if (!peripheriques_chauffage[c].last_etat.histo_consigne){
																peripheriques_chauffage[c].last_etat.histo_consigne=[];
															}
															peripheriques_chauffage[c].last_etat.histo_consigne.push({date_heure:GLOBAL.req.moment().format('DD/MM/YY HH:mm:ss.SSSS'),consigne:val_next,id:c,mode:mode_nom,funct:"appliquenextconsigne"});
															if (peripheriques_chauffage[c].last_etat.histo_consigne.length>15) {
																peripheriques_chauffage[c].last_etat.histo_consigne.shift();
															}
														};
													}(c,valeur,mode.nom),'automation_programmation');										
												}
			
											}
										}
									}
								}
							}
							GLOBAL.obj.app.serveur.emit('programmation_consigne.appliquenextconsigne');
							calculconsigneencours=false;
						} catch (e) {
							logger('ERROR',{nom:programmation_all.nom,id:programmation_all.id
								,msg:'--Error dans application next consigne--'
									,error:e
									},'automation_'+programmation_all.nom);
						}
					});
			
				});
			}
		}
}

function appliquepreviousconsigne(id){
	//if (calculconsigneencours) return;
	if (programmation_all.etat=='OFF') return;
	//calculconsigneencours=true;
	logger('INFO',{msg:'-----appliquer la consigne precedente appliquepreviousconsigne',id:id},'automation_'+programmation_all.nom);
	for (var categ_item in GLOBAL.obj.categories){
		if (GLOBAL.obj.categories[categ_item].programmable=='O'){
			//console.log('-----appliquer la consigne precedente appliquepreviousconsigne',GLOBAL.obj.categories[categ_item].nom);
			calcul_consigne(GLOBAL.obj.categories[categ_item],function(id,categorie){return function(rep_prev){
				logger('INFO',{msg:'-----calcul fait appliquepreviousconsigne',id:id},'automation_'+programmation_all.nom);
		
				//logger('DEBUG',{msg:'programmation en cours',prog:rep_prev},'automation_'+programmation_consigne.nom);
				//console.log(rep_prev);
				GLOBAL.req.mode.get_etat(function(err,mode){
					var mode_actuel=0;
					if (mode) mode_actuel=mode.id;
					logger('INFO',{msg:'-----recherche mode fait appliquepreviousconsigne',id:id,mode_actuel:mode_actuel},'automation_'+programmation_all.nom);
					var peripheriques_chauffage=[];
					for (var c in GLOBAL.obj.peripheriques_chauffage){
						if (GLOBAL.obj.peripheriques_chauffage[c].ecriture_type!='TEMPERATURE' &&
								GLOBAL.obj.peripheriques_chauffage[c].ecriture_type!='SANS' &&
								GLOBAL.obj.peripheriques_chauffage[c].categorie.id==categorie.id){
							peripheriques_chauffage.push(GLOBAL.obj.peripheriques_chauffage[c]);
						}
					}
					for (var c in GLOBAL.obj.peripheriquesdeportes){
						if (GLOBAL.obj.peripheriquesdeportes[c].ecriture_type!='TEMPERATURE' &&
								GLOBAL.obj.peripheriquesdeportes[c].ecriture_type!='SANS' &&
								GLOBAL.obj.peripheriquesdeportes[c].categorie.id==categorie.id){
							peripheriques_chauffage.push(GLOBAL.obj.peripheriquesdeportes[c]);
						}
					}
					for (var c in GLOBAL.obj.peripheriques){
						if (GLOBAL.obj.peripheriques[c].ecriture_type!='TEMPERATURE' &&
								GLOBAL.obj.peripheriques[c].categorie &&
								GLOBAL.obj.peripheriques[c].categorie.id==categorie.id){
							peripheriques_chauffage.push(GLOBAL.obj.peripheriques[c]);
						}
					}
					//console.log('mode='+mode_actuel + "   "+rep_prev);
					for (var previous_id in rep_prev.previous){
						if (rep_prev.previous[previous_id].mode=="mode_"+mode_actuel){
							for (var c in peripheriques_chauffage){
								var tag_id=peripheriques_chauffage[c].id;
								if (peripheriques_chauffage[c].tag && peripheriques_chauffage[c].tag[0]){
									tag_id='tag_'+peripheriques_chauffage[c].tag[0].id;
								}
								//logger('INFO',{msg:('--------compare--previous_id='+previous_id+'--id='+id+'--rep_prev.previous[previous_id].tag='+rep_prev.previous[previous_id].tag)},'automation_'+programmation_consigne.nom);
								if (rep_prev.previous[previous_id].mode+'_'+tag_id==previous_id
										&&(!id || (id && id==rep_prev.previous[previous_id].tag)) /*&&
										peripheriques_chauffage[c].ecriture_type=='TEMPERATURECONSIGNE'*/
										&& (!rep_prev.previous[previous_id].peripherique ||
												rep_prev.previous[previous_id].peripherique==peripheriques_chauffage[c].id)){
									
									//if (rep.previous[previous_id].previouseventsec<=900)
									//	console.log('Consigne va passer à '+rep.previous[previous_id].valeur+' dans ' + (rep.previous[previous_id].previouseventsec/60) + ' minutes pour '+rep.previous[previous_id].mode+' et '+ rep.previous[previous_id].tag);
									//if (rep.previous[previous_id].previouseventsec<=60){
										logger('INFO',{nom:programmation_all.nom,id:id,idp:programmation_all.id
											,msg:'--Application nouvelle consigne--'
												,res:'---> Consigne passe à '+rep_prev.previous[previous_id].valeur + ' tag ' +rep_prev.previous[previous_id].tag
										},'automation_'+programmation_all.nom);
										if (peripheriques_chauffage[c].last_etat && peripheriques_chauffage[c].last_etat.expression){
											//console.log(GLOBAL.obj.peripheriques_chauffage[c].uuid +" : "+GLOBAL.obj.peripheriques_chauffage[c].last_etat.expression.etat);
										}
										if ((!peripheriques_chauffage[c].last_etat) || 
											 !peripheriques_chauffage[c].last_etat.expression || 
											 !peripheriques_chauffage[c].last_etat.expression.etat ||
											 (peripheriques_chauffage[c].last_etat && 
											  peripheriques_chauffage[c].last_etat.expression && 
											  peripheriques_chauffage[c].last_etat.expression.etat &&
											  peripheriques_chauffage[c].last_etat.expression.etat!=rep_prev.previous[previous_id].valeur)
											  ){
											var valeur=rep_prev.previous[previous_id].valeur;
											var cmd='DIM';
											if (valeur=='ON') {
												valeur=peripheriques_chauffage[c].ecriture_max_value;
												cmd='ON'
											} else if (valeur=='OFF') {
												valeur=peripheriques_chauffage[c].ecriture_min_value;
												cmd='OFF'	
											}
											peripheriques_chauffage[c].set_etat(cmd,valeur,
													function (c,val_previous,mode_nom){
													return function(rep){
														if (!peripheriques_chauffage[c].last_etat.histo_consigne){
															peripheriques_chauffage[c].last_etat.histo_consigne=[];
														}
														peripheriques_chauffage[c].last_etat.histo_consigne.push({date_heure:GLOBAL.req.moment().format('DD/MM/YY HH:mm:ss.SSSS'),consigne:val_previous,id:c,mode:mode_nom,funct:"appliquepreviousconsigne"});
														if (peripheriques_chauffage[c].last_etat.histo_consigne.length>15) {
															peripheriques_chauffage[c].last_etat.histo_consigne.shift();
														}
													};
												}(c,valeur,mode.nom),'automation_programmation');									
										}
		
									//}
								}
							}
						}
					}
					GLOBAL.obj.app.serveur.emit('programmation_consigne.appliquepreviousconsigne');	
					infirstappliqueprevious=true;
					//calculconsigneencours=false;
				});
		
			};}(id,GLOBAL.obj.categories[categ_item]));
		}
	}
}
programmation_all.appliquepreviousconsigne=appliquepreviousconsigne;


function calcul_consigne(categorie,callbackc){

	
	var result={};
	var sql="  select distinct 'mode_' || m.id mode,'tag_' || t.id tag,c.peripherique,c.id prog_id,c.heure,c.valeur,cj.id_jours ";
		sql+=" from consigne_temp c inner join tag t on t.id=c.tag";
		sql+="    					inner join mode m on m.id=c.mode";
		sql+="    					inner join consigne_temp_jours cj on cj.id_consigne_temp=c.id";
		sql+="						inner join categorie ca on ca.id=c.categorie and ca.id='"+categorie.id+"'";
		sql+=" order by mode,tag,categorie,prog_id"	;
	GLOBAL.obj.app.db.sqlorder(sql,function(callback,categorie){
		return function(rows){
			var arraynextevent={};
			var arraypreviousevent={};
			var semaine={Lu:1,Ma:2,Me:3,Je:4,Ve:5,Sa:6,Di:7};

			
			var datetimeactuel=new Date();
			var joursemaineactuel=gettoday(datetimeactuel);
			console.log('*Date Heure actuel**',datetimeactuel,'*jour num*',joursemaineactuel);
			
			/*datetimeactuel.setTime( datetimeactuel.getTime() - datetimeactuel.getTimezoneOffset()*60*1000 );*/
			//console.log('****Date actuel after correction*****',datetimeactuel);
			for (var l in rows){
				var obj={}
				var lig=rows[l];
				var timeregexe=/(\d{1,2})h(\d{1,2})/;
				var timearray=timeregexe.exec(lig.heure);
				
				var nextday=getNextDayOfWeek(datetimeactuel,semaine[lig.id_jours],parseInt(timearray[1]),parseInt(timearray[2]));
				
				var previousday=getPreviousDayOfWeek(datetimeactuel,semaine[lig.id_jours],parseInt(timearray[1]),parseInt(timearray[2]));
				
				obj.nextdate=nextday;
				obj.nexteventsec=(nextday-datetimeactuel)/1000;
				obj.previousdate=previousday;
				obj.previouseventsec=(datetimeactuel-previousday)/1000;
				obj.peripherique=lig.peripherique;
				obj.mode=lig.mode;
				obj.tag=lig.tag;
				obj.valeur=lig.valeur;
				if (obj.previouseventsec == null || obj.nexteventsec==null
						|| isNaN(obj.previouseventsec) || isNaN(obj.nexteventsec)){
					logger('ERROR',{msg:'programmation en cours error',datetimeactuel:datetimeactuel,jour:semaine[lig.id_jours],timearray:timearray,ligsql:lig,calcul:obj},'automation_'+programmation_all.nom);
				}
				var nextday=getNextDayOfWeek(datetimeactuel,semaine[lig.id_jours],parseInt(timearray[1]),parseInt(timearray[2]));
				
				//logger('DEBUG',{msg:'programmation en cours',datetimeactuel:datetimeactuel,jour:semaine[lig.id_jours],timearray:timearray,ligsql:lig,calcul:obj},'automation_'+programmation_consigne.nom);
				if (arraynextevent[obj.mode+'_'+obj.tag]){
					//console.log(arraynextevent[obj.mode+'_'+obj.tag].nextdate.getTime() + " > " + obj.nextdate.getTime());
					if (arraynextevent[obj.mode+'_'+obj.tag].nextdate.getTime()>obj.nextdate.getTime()){
						arraynextevent[obj.mode+'_'+obj.tag]=obj;
						//logger('DEBUG',{msg:'oknextevent',tag:obj.mode+'_'+obj.tag,timedefine:obj.nextdate.getTime()},'automation_'+programmation_consigne.nom);
						//console.log('yes');
					} else {
						//console.log('no');
					}
				} else {
					//logger('DEBUG',{msg:'oknextevent1er',tag:obj.mode+'_'+obj.tag,timedefine:obj.nextdate.getTime()},'automation_'+programmation_consigne.nom);
					arraynextevent[obj.mode+'_'+obj.tag]=obj;
				}				
				
				if (arraypreviousevent[obj.mode+'_'+obj.tag]){
					if (arraypreviousevent[obj.mode+'_'+obj.tag].previousdate.getTime()<obj.previousdate.getTime()){
						//logger('DEBUG',{msg:'okpreviousevent',tag:obj.mode+'_'+obj.tag,timedefine:obj.previousdate.getTime()},'automation_'+programmation_consigne.nom);
						arraypreviousevent[obj.mode+'_'+obj.tag]=obj;
					}
				} else {
					//logger('DEBUG',{msg:'okpreviousevent1er',tag:obj.mode+'_'+obj.tag,timedefine:obj.previousdate.getTime()},'automation_'+programmation_consigne.nom);
					arraypreviousevent[obj.mode+'_'+obj.tag]=obj;
				}
				
			}
		
			for (t in arraynextevent){
				var ele=arraynextevent[t];
				recurciseAffect_child(ele,arraynextevent)
				
			}
			for (t in arraypreviousevent){
				var ele=arraypreviousevent[t];
				recurciseAffect_child(ele,arraypreviousevent)
				
			}
			var result={currentTime:datetimeactuel,previous:arraypreviousevent,next:arraynextevent};
			callback(result,categorie);
		};
	}(callbackc,categorie));
	
}
function recurciseAffect_child(ele,arraysevent){
		var tagregex=/tag_(\d{1,10}$)/;
		var tagid=tagregex.exec(ele.tag)[1];
		var tag=GLOBAL.obj.app.core.findobj(tagid,'tags');
		var tag_childrens=tag.get_child();
		
		for (var c in tag_childrens) {
			if (arraysevent[ele.mode+'_tag_'+tag_childrens[c].id]){
				/*déjà une prog*/
			} else {
				var newele={};
				newele.mode=ele.mode;
				newele.nextdate=ele.nextdate;
				newele.nexteventsec=ele.nexteventsec;
				newele.previousdate=ele.previousdate;
				newele.previouseventsec=ele.previouseventsec;
				newele.tag='tag_'+tag_childrens[c].id;
				newele.valeur=ele.valeur;
				arraysevent[newele.mode+'_tag_'+tag_childrens[c].id]=newele;
				recurciseAffect_child(newele,arraysevent);
			}
		}
		
	
}

function getPreviousDayOfWeek(datetimeactuel,NumdayOfWeek,heure,minute) {
    // Code to check that date and dayOfWeek are valid left as an exercise ;)
	var dayOfWeek=NumdayOfWeek;
	if (NumdayOfWeek>gettoday(datetimeactuel)) NumdayOfWeek-=7;
	

    var actuelDate = datetimeactuel;
    var resultDate = new Date();
    resultDate.setUTCDate(actuelDate.getDate()-gettoday(datetimeactuel)+ NumdayOfWeek);
    resultDate.setHours(heure)
    resultDate.setMinutes(minute)
    resultDate.setSeconds(0)
    resultDate.setMilliseconds(0)    
    
    if (actuelDate.getTime()<resultDate.getTime()) resultDate.setUTCDate(resultDate.getDate()-7);
    return resultDate;
}

function getNextDayOfWeek(datetimeactuel,NumdayOfWeek,heure,minute) {
    // Code to check that date and dayOfWeek are valid left as an exercise ;)
	var dayOfWeek=NumdayOfWeek;
	if (NumdayOfWeek<gettoday(datetimeactuel)) NumdayOfWeek+=7;
	
    var actuelDate = datetimeactuel
    var resultDate= new Date();
    resultDate.setUTCDate(actuelDate.getDate()-gettoday(datetimeactuel)+ NumdayOfWeek);
    resultDate.setHours(heure)
    resultDate.setMinutes(minute)
    resultDate.setSeconds(0)
    resultDate.setMilliseconds(0)   
    if (actuelDate.getTime()>resultDate.getTime()) resultDate.setUTCDate(resultDate.getDate()+7);
    
    return resultDate;
}

function gettoday(datetimeactuel){
	var d = datetimeactuel;
	var n = d.getDay();
	if (n==0) return 7;
	return n;
}

module.exports = programmation_all;