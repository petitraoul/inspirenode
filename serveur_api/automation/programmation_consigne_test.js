/**
 * New node file
 */
var programmation_consigne_test={id:311253,nom:"programmation_consigne_test",etat:"OFF",lastrun:null};
var infirstappliqueprevious=false;
var calculconsigneencours=false;
var timer=null;


programmation_consigne_test.start=function(){
	if (programmation_consigne_test.etat=='OFF') {
		programmation_consigne_test.etat='ON';
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
				logger('INFO',{msg:'Controle date ',datetimeactuel:datetimeactuel},'automation_'+programmation_consigne_test.nom);
				datetimeactuel.setTime( datetimeactuel.getTime() - datetimeactuel.getTimezoneOffset()*60*1000 );
				logger('INFO',{msg:'Controle date + timezone GMT+ n Heures',datetimeactuel:datetimeactuel,decalage:datetimeactuel.getTimezoneOffset()},'automation_'+programmation_consigne_test.nom);
				
			}, 60000);			
		},12000);
	}
}

programmation_consigne_test.stop=function(){
	if (programmation_consigne_test.etat=='ON') {
		programmation_consigne_test.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		//obj.app.serveur.removeListener('consigne_chauffage.controleChauffage',function(){appliquenextconsigne();});
		obj.app.serveur.removeListener('mode.last_etat.added',function(){appliquepreviousconsigne();});
		obj.app.serveur.removeListener('mode.last_etat.changed',function(){appliquepreviousconsigne();});
		obj.app.serveur.removeListener('programmation_consigne.changed',function(){appliquepreviousconsigne();});	
		clearInterval(timer);
	}
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
	appliqueconsigne();
}
function appliquepreviousconsigne(){
	appliqueconsigne(true);
}
function appliqueconsigne(forceprevious){
	//if (calculconsigneencours) return;
	if (programmation_consigne_test.etat=='OFF') return;
	//calculconsigneencours=true;
		GLOBAL.req.mode.get_etat(function(err,mode){
			var mode_actuel=0;
			if (mode) mode_actuel=mode.id;
			logger('INFO',{msg:'-----recherche mode fait appliquepreviousconsigne',mode_actuel:mode_actuel},'automation_'+programmation_consigne_test.nom);
			get_nextprevious_consigne(mode_actuel,
					function(rep){
				
			
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
						for (var t in rep){
							if (rep[t].previous || rep[t].next) {
								for (var c in peripheriques_chauffage) {
									if (t==peripheriques_chauffage[c].id &&
												peripheriques_chauffage[c].ecriture_type=='TEMPERATURECONSIGNE'){
										var consigneaappliquer=null;
										var periode_minutes=3;
										logger('INFO',{tag:t,type:'previous',dans:rep[t].previous.ecart_minutes,valeur:rep[t].previous.valeur},'automation_'+programmation_consigne_test.nom);
										logger('INFO',{tag:t,type:'next',dans:rep[t].next.ecart_minutes,valeur:rep[t].next.valeur},'automation_'+programmation_consigne_test.nom);
										if (rep[t].previous && forceprevious) {
											consigneaappliquer=rep[t].previous;
											logger('INFO',{msg:'consigne a appliquer car force consigne precedente',forceprevious:forceprevious,val:consigneaappliquer.valeur ,tag: ' tag ' +t},'automation_'+programmation_consigne_test.nom);
										}
										if (rep[t].previous && rep[t].previous.ecart_minutes<=periode_minutes) {
											consigneaappliquer=rep[t].previous;
											logger('INFO',{msg:'consigne a appliquer car difference time entre previous consigne ok',val:consigneaappliquer.valeur ,tag: ' tag ' +t},'automation_'+programmation_consigne_test.nom);
											
										}  if (rep[t].previous && (!peripheriques_chauffage[c].last_etat ||
																!peripheriques_chauffage[c].last_etat.expression ||
																!peripheriques_chauffage[c].last_etat.expression.etat)){
											consigneaappliquer=rep[t].previous;
											logger('INFO',{msg:'consigne a appliquer car pas d etat pour ce periph de chauffe',val:consigneaappliquer.valeur ,tag: ' tag ' +t},'automation_'+programmation_consigne_test.nom);
										} if (rep[t].next && rep[t].next.ecart_minutes<=periode_minutes) {
											consigneaappliquer=rep[t].next;
											logger('INFO',{msg:'consigne a appliquer car difference time entre next consigne ok',ecart_min:rep[t].next.ecart_minutes,val:consigneaappliquer.valeur ,tag: ' tag ' +t},'automation_'+programmation_consigne_test.nom);
										}

																				
										
										
										if (consigneaappliquer){
											
											logger('INFO',{nom:programmation_consigne_test.nom,idp:programmation_consigne_test.id
												,msg:'--Application nouvelle consigne--'
													,res:'---> Consigne passe à '+consigneaappliquer.valeur + ' tag ' +t
											},'automation_'+programmation_consigne_test.nom);
											

												peripheriques_chauffage[c].set_etat('DIM',consigneaappliquer.valeur,
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
													}(c,consigneaappliquer.valeur,mode.nom),'automation_programmation');									
											

										}
									}
								}
							}

						}
			
						/*GLOBAL.obj.app.serveur.emit('programmation_consigne.appliquepreviousconsigne');*/	
						/*infirstappliqueprevious=true;*/
						//calculconsigneencours=false;
			});
		});
	
}

programmation_consigne_test.appliquepreviousconsigne=appliquepreviousconsigne;

function get_nextprevious_consigne(mode_id,callback){

	var sql="select * from (" +
			" SELECT id tag,dateactuel,'now' source,  strftime('%w',dateactuel)+0 jour_num," +
			"			case when strftime('%w',dateactuel)+0=1 then 'Lu'  " +
			"when strftime('%w',dateactuel)+0=2 then 'Ma'   " +
			"when strftime('%w',dateactuel)+0=3 then 'Me'   " +
			"when strftime('%w',dateactuel)+0=4 then 'Je'  " +
			"when strftime('%w',dateactuel)+0=5 then 'Ve'   " +
			"when strftime('%w',dateactuel)+0=6 then 'Sa'  " +
			"when strftime('%w',dateactuel)+0=0 then 'Di'  end id_jours," +
			"	       strftime('%H',dateactuel)+0 heur_num,strftime('%M',dateactuel)+0 minu_num,'' valeur,'' categorie,''peripherique,'' heure" +
			" from tag, (select datetime('now',/*'-3 day','-21 hours',*/'localtime') dateactuel)" +
			" union" +
			" select tag,''|| id_consigne_temp source,''dateactuel," +
			"		case when id_jours='Lu' then 1+decal " +
			"when id_jours='Ma' then 2+decal " +
			"when id_jours='Me' then 3+decal " +
			"when id_jours='Je' then 4+decal " +
			"when id_jours='Ve' then 5+decal " +
			"when id_jours='Sa' then 6+decal " +
			"when id_jours='Di' then 0+decal end jour_num," +
			"		id_jours,case when substr(heure,3,1)='h' then substr(heure,1,2)+0 else substr(heure,1,1)+0 end,case when substr(heure,3,1)='h' then substr(heure,4,2)+0 else substr(heure,3,2)+0 end,	c.valeur,c.categorie,c.peripherique,c.heure" +
			" from consigne_temp_jours j inner join consigne_temp c on c.id=j.id_consigne_temp	cross join (select -7 decal union select 0 decal union select 7 decal)" +
			" where mode='"+mode_id+"')" +
			" order by tag+0, jour_num,heur_num+0,minu_num+0";
	var consigne_tag={mode_id:mode_id};
	GLOBAL.obj.app.db.sqlorder(sql,
			function(rows){
				if (rows) {
					logger('INFO',{nom:programmation_consigne_test.nom,idp:programmation_consigne_test.id
						,msg:'--Requete lignes previous et next consigne--',res:rows},'automation_'+programmation_consigne_test.nom);
						for (var l in rows ){
						var lig=l*1;
						if (rows[lig].source=='now'
							&& lig>0 && rows[lig-1].tag==rows[lig].tag
							&& lig<rows.length-1 && rows[lig+1].tag==rows[lig].tag){
							logger('INFO',{nom:programmation_consigne_test.nom,idp:programmation_consigne_test.id
								,msg:'-------debut_tag-',lig:lig,tag:'tag_'+rows[lig].tag},'automation_'+programmation_consigne_test.nom);
							console.log('boucle rows1','tag_'+rows[lig].tag);
							consigne_tag['tag_'+rows[lig].tag]={tag_id:rows[lig].tag};
							consigne_tag['tag_'+rows[lig].tag].previous=rows[lig-1];
							consigne_tag['tag_'+rows[lig].tag].next=rows[lig+1];
							consigne_tag['tag_'+rows[lig].tag].now=rows[lig];
							
							var previousdepuis=(rows[lig].jour_num-rows[lig-1].jour_num)*24*60;
							previousdepuis+=(rows[lig].heur_num-rows[lig-1].heur_num)*60;
							previousdepuis+=(rows[lig].minu_num-rows[lig-1].minu_num);
							consigne_tag['tag_'+rows[lig].tag].previous.ecart_minutes=previousdepuis;
							
							var nextdans=(rows[lig+1].jour_num-rows[lig].jour_num)*24*60;
							nextdans+=(rows[lig+1].heur_num-rows[lig].heur_num)*60;
							nextdans+=(rows[lig+1].minu_num-rows[lig].minu_num);
							consigne_tag['tag_'+rows[lig].tag].next.ecart_minutes=nextdans;
							console.log('boucle rows2','tag_'+rows[lig].tag);
							logger('INFO',{nom:programmation_consigne_test.nom,idp:programmation_consigne_test.id
								,msg:'-------fin_tag-',lig:lig,tag:'tag_'+rows[lig].tag,res:consigne_tag['tag_'+rows[lig].tag]},'automation_'+programmation_consigne_test.nom);
						}						
					}
				}
				//console.log(JSON.stringify(consigne_tag));
				logger('INFO',{nom:programmation_consigne_test.nom,idp:programmation_consigne_test.id
					,msg:'--Calcul previous et next consigne resultat--',res:consigne_tag},'automation_'+programmation_consigne_test.nom);
				for (var t in consigne_tag){
					console.log('boucle applique recurcive',t);
					recurciseAffect_child(consigne_tag[t].tag_id,consigne_tag);
				}
				
				callback(consigne_tag);
	});	
	
}

function recurciseAffect_child(tagid,arraysevent){

		var tag=GLOBAL.obj.app.core.findobj(tagid,'tags');
		if (tag){
			var tag_childrens=tag.get_child();
			
			for (var c in tag_childrens) {
				if (arraysevent['tag_'+tag_childrens[c].id]){
					/*déjà une prog*/
				} else {
					var newele={};
					newele.tag_id=tag_childrens[c].id;
					newele.previous=arraysevent['tag_'+tagid].previous;
					newele.next=arraysevent['tag_'+tagid].next;
					newele.now=arraysevent['tag_'+tagid].now;
					arraysevent['tag_'+tag_childrens[c].id]=newele;
					recurciseAffect_child(tag_childrens[c].id,arraysevent);
				}
			}
		}

		
	
}


module.exports = programmation_consigne_test;