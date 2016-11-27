/**
 * New node file
 */
var programmation_consigne={id:3,nom:"programmation_consigne",etat:"OFF",lastrun:null};
var infirstappliqueprevious=false;
var calculconsigneencours=false;
var timer=null;


programmation_consigne.start=function(){
	if (programmation_consigne.etat=='OFF') {
		programmation_consigne.etat='ON';
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
				logger('INFO',{msg:'Controle date ',datetimeactuel:datetimeactuel},'automation_'+programmation_consigne.nom);
				datetimeactuel.setTime( datetimeactuel.getTime() - datetimeactuel.getTimezoneOffset()*60*1000 );
				logger('INFO',{msg:'Controle date + timezone GMT+ n Heures',datetimeactuel:datetimeactuel,decalage:datetimeactuel.getTimezoneOffset()},'automation_'+programmation_consigne.nom);
				
			}, 60000);			
		},12000);
	}
}

programmation_consigne.stop=function(){
	if (programmation_consigne.etat=='ON') {
		programmation_consigne.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		//obj.app.serveur.removeListener('consigne_chauffage.controleChauffage',function(){appliquenextconsigne();});
		obj.app.serveur.removeListener('mode.last_etat.added',function(){appliquepreviousconsigne();});
		obj.app.serveur.removeListener('mode.last_etat.changed',function(){appliquepreviousconsigne();});
		obj.app.serveur.removeListener('programmation_consigne.changed',function(){appliquepreviousconsigne();});	
		clearInterval(timer);
	}
}


programmation_consigne.test=function (res){
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
			if (rows) {
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
	if (calculconsigneencours || programmation_consigne.etat=='OFF') return;
	calculconsigneencours=true;
	/*logger('INFO',{nom:programmation_consigne.nom,id:programmation_consigne.id
		,msg:'--Calcul application consigne suivante--'},'automation_'+programmation_consigne.nom);*/
	//console.log('-----appliquer la consigne suivante appliquenextconsigne')
		
		calcul_consigne(function(rep2){
			//logger('DEBUG',{msg:'programmation en cours',prog:rep2},'automation_'+programmation_consigne.nom);
			
			var rep1=rep2;
			GLOBAL.req.mode.get_etat(function(err,mode){
				var rep=rep1;
				var mode_actuel=0;
				if (mode) mode_actuel=mode.id;
				var peripheriques_chauffage=[];
				for (var c in GLOBAL.obj.peripheriques_chauffage){
					if (GLOBAL.obj.peripheriques_chauffage[c].ecriture_type=='TEMPERATURECONSIGNE'){
						peripheriques_chauffage.push(GLOBAL.obj.peripheriques_chauffage[c]);
					}
				}
				for (var c in GLOBAL.obj.peripheriquesdeportes){
					if (GLOBAL.obj.peripheriquesdeportes[c].ecriture_type=='TEMPERATURECONSIGNE'){
						peripheriques_chauffage.push(GLOBAL.obj.peripheriquesdeportes[c]);
					}
				}
				for (var next_id in rep.next){
					if (rep.next[next_id].mode=="mode_"+mode_actuel){
						for (var c in peripheriques_chauffage){
							var tag_id=peripheriques_chauffage[c].id;
							if (peripheriques_chauffage[c].tag && peripheriques_chauffage[c].tag[0]){
								tag_id='tag_'+peripheriques_chauffage[c].tag[0].id;
							}
							if (rep.next[next_id].mode+'_'+tag_id==next_id &&
									peripheriques_chauffage[c].ecriture_type=='TEMPERATURECONSIGNE'){
								if (rep.next[next_id].nexteventsec<=900 && rep.next[next_id].nexteventsec>300)
									logger('INFO','Consigne va passer à '+rep.next[next_id].valeur+' dans ' + (rep.next[next_id].nexteventsec/60) + ' minutes pour '+rep.next[next_id].mode+' et '+ rep.next[next_id].tag
											,'automation_'+programmation_consigne.nom);
								if (rep.next[next_id].nexteventsec<=300){
									logger('INFO',{nom:programmation_consigne.nom,id:programmation_consigne.id
										,msg:'--Application nouvelle consigne--'
										,res:'---> Consigne passe à '+rep.next[next_id].valeur+' dans ' + (rep.next[next_id].nexteventsec/60) + ' minutes pour '+rep.next[next_id].mode+' et '+ rep.next[next_id].tag
										},'automation_'+programmation_consigne.nom);
									
									//console.log('---> Consigne passe à '+rep.next[next_id].valeur+' dans ' + (rep.next[next_id].nexteventsec/60) + ' minutes pour '+rep.next[next_id].mode+' et '+ rep.next[next_id].tag);
									if ((!peripheriques_chauffage[c].last_etat) || !peripheriques_chauffage[c].last_etat.expression || !peripheriques_chauffage[c].last_etat.expression.etat || 
											(peripheriques_chauffage[c].last_etat && peripheriques_chauffage[c].last_etat.expression && peripheriques_chauffage[c].last_etat.expression.etat &&
													peripheriques_chauffage[c].last_etat.expression.etat!=rep.next[next_id].valeur)){
										peripheriques_chauffage[c].set_etat('DIM',rep.next[next_id].valeur,
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
										}(c,rep.next[next_id].valeur,mode.nom),'automation_programmation');										
									}

								}
							}
						}
					}
				}
				GLOBAL.obj.app.serveur.emit('programmation_consigne.appliquenextconsigne');
				calculconsigneencours=false;
			});
	
		});
	
}

function appliquepreviousconsigne(id){
	//if (calculconsigneencours) return;
	if (programmation_consigne.etat=='OFF') return;
	//calculconsigneencours=true;
	logger('INFO',{msg:'-----appliquer la consigne precedente appliquepreviousconsigne',id:id},'automation_'+programmation_consigne.nom);

	//console.log('-----appliquer la consigne precedente appliquepreviousconsigne')
	calcul_consigne(function(id){return function(rep_prev){
		logger('INFO',{msg:'-----calcul fait appliquepreviousconsigne',id:id},'automation_'+programmation_consigne.nom);

		//logger('DEBUG',{msg:'programmation en cours',prog:rep_prev},'automation_'+programmation_consigne.nom);
		//console.log(rep_prev);
		GLOBAL.req.mode.get_etat(function(err,mode){
			var mode_actuel=0;
			if (mode) mode_actuel=mode.id;
			logger('INFO',{msg:'-----recherche mode fait appliquepreviousconsigne',id:id,mode_actuel:mode_actuel},'automation_'+programmation_consigne.nom);
			var peripheriques_chauffage=[];
			for (var c in GLOBAL.obj.peripheriques_chauffage){
				if (GLOBAL.obj.peripheriques_chauffage[c].ecriture_type=='TEMPERATURECONSIGNE'){
					peripheriques_chauffage.push(GLOBAL.obj.peripheriques_chauffage[c]);
				}
			}
			for (var c in GLOBAL.obj.peripheriquesdeportes){
				if (GLOBAL.obj.peripheriquesdeportes[c].ecriture_type=='TEMPERATURECONSIGNE'){
					peripheriques_chauffage.push(GLOBAL.obj.peripheriquesdeportes[c]);
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
								&&(!id || (id && id==rep_prev.previous[previous_id].tag)) &&
								peripheriques_chauffage[c].ecriture_type=='TEMPERATURECONSIGNE'){
							//if (rep.previous[previous_id].previouseventsec<=900)
							//	console.log('Consigne va passer à '+rep.previous[previous_id].valeur+' dans ' + (rep.previous[previous_id].previouseventsec/60) + ' minutes pour '+rep.previous[previous_id].mode+' et '+ rep.previous[previous_id].tag);
							//if (rep.previous[previous_id].previouseventsec<=60){
								logger('INFO',{nom:programmation_consigne.nom,id:id,idp:programmation_consigne.id
									,msg:'--Application nouvelle consigne--'
										,res:'---> Consigne passe à '+rep_prev.previous[previous_id].valeur + ' tag ' +rep_prev.previous[previous_id].tag
								},'automation_'+programmation_consigne.nom);
								if (peripheriques_chauffage[c].last_etat && peripheriques_chauffage[c].last_etat.expression){
									//console.log(GLOBAL.obj.peripheriques_chauffage[c].uuid +" : "+GLOBAL.obj.peripheriques_chauffage[c].last_etat.expression.etat);
								}
								if ((!peripheriques_chauffage[c].last_etat) || !peripheriques_chauffage[c].last_etat.expression || !peripheriques_chauffage[c].last_etat.expression.etat ||
										(peripheriques_chauffage[c].last_etat && peripheriques_chauffage[c].last_etat.expression && peripheriques_chauffage[c].last_etat.expression.etat &&
												peripheriques_chauffage[c].last_etat.expression.etat!=rep_prev.previous[previous_id].valeur)){
									peripheriques_chauffage[c].set_etat('DIM',rep_prev.previous[previous_id].valeur,
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
										}(c,rep_prev.previous[previous_id].valeur,mode.nom),'automation_programmation');									
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

	};}(id));
	
}
programmation_consigne.appliquepreviousconsigne=appliquepreviousconsigne;


function calcul_consigne(callbackc){

	
	var result={};
	var sql="  select distinct 'mode_' || m.id mode,'tag_' || t.id tag,c.id prog_id,c.heure,c.valeur,cj.id_jours ";
		sql+=" from consigne_temp c,tag t,mode m, consigne_temp_jours cj";
		sql+=" where c.mode=m.id";
		sql+=" and c.tag=t.id";
		sql+=" and cj.id_consigne_temp=c.id";
		sql+=" order by mode,tag,prog_id"	;
	GLOBAL.obj.app.db.sqlorder(sql,function(callback){
		return function(rows){
			var arraynextevent={};
			var arraypreviousevent={};
			var semaine={Lu:1,Ma:2,Me:3,Je:4,Ve:5,Sa:6,Di:7};

			
			var datetimeactuel=new Date();
			var joursemaineactuel=gettoday(datetimeactuel);
			datetimeactuel.setTime( datetimeactuel.getTime() - datetimeactuel.getTimezoneOffset()*60*1000 );
			
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
				obj.mode=lig.mode;
				obj.tag=lig.tag;
				obj.valeur=lig.valeur;
				if (obj.previouseventsec == null || obj.nexteventsec==null
						|| isNaN(obj.previouseventsec) || isNaN(obj.nexteventsec)){
					logger('ERROR',{msg:'programmation en cours error',datetimeactuel:datetimeactuel,jour:semaine[lig.id_jours],timearray:timearray,ligsql:lig,calcul:obj},'automation_'+programmation_consigne.nom);
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
			callback(result);
		};
	}(callbackc));
	
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
    resultDate.setUTCHours(heure)
    resultDate.setUTCMinutes(minute)
    resultDate.setUTCSeconds(0)
    resultDate.setUTCMilliseconds(0)    
    
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
    
    resultDate.setUTCHours(heure)
    resultDate.setUTCMinutes(minute)
    resultDate.setUTCSeconds(0)
    resultDate.setUTCMilliseconds(0)   
    
    if (actuelDate.getTime()>resultDate.getTime()) resultDate.setUTCDate(resultDate.getDate()+7);
    return resultDate;
}

function gettoday(datetimeactuel){
	var d = datetimeactuel;
	var n = d.getDay();
	if (n==0) return 7;
	return n;
}

module.exports = programmation_consigne;