/**
 * New node file
 */


var class_periph_batterie = function peripherique_batterie(){
	
	var self =this;
	
	
	/*self.get_etat=function(callback){
		self.box.get_etat(function(periph,res){		
			res.constantes={};
			for (var c in GLOBAL.obj.constantes){
				var co=GLOBAL.obj.constantes[c];
				res.constantes[co.nom]=co.valeur;
			}
			
			var manque_etat_enfant=false;
			res.sondes_autres={};
			for (var s in self.sondes_autres){
				if(!self.sondes_autres[s].last_etat) manque_etat_enfant=true;
				res.sondes_autres['id_'+self.sondes_autres[s].id]=self.sondes_autres[s].last_etat;
			}
			res.chauffage={};
			for (var s in self.chauffage){
				if(!self.chauffage[s].last_etat) manque_etat_enfant=true;
				res.chauffage['id_'+self.chauffage[s].id]=self.chauffage[s].last_etat;
			}
			res.sondes_temp={};
			for (var s in self.sondes_temp){
				if(!self.sondes_temp[s].last_etat) manque_etat_enfant=true;
				res.sondes_temp['id_'+self.sondes_temp[s].id]=self.sondes_temp[s].last_etat;
			}
			res.chaudiere={};
			for (var s in self.chaudiere){
				if(!self.chaudiere[s].last_etat) manque_etat_enfant=true;
				res.chaudiere['id_'+self.chaudiere[s].id]=self.chaudiere[s].last_etat;
			}
			if (manque_etat_enfant) res.erreur="manque_etat_enfant";
			callback(periph,res);
			
		},self);

	}*/
	/*self.set_etat=function(cmd,val,callback){
		self.box.set_etat(self,cmd,val,callback);
	}*/
}



class_periph_batterie.generationGlobale=function(callback){
	//console.log('chargement batteries');
	var periphs_batterie={};
	var indexcategbatterie=0;
	for ( var c in GLOBAL.obj.categories) {
		if (GLOBAL.obj.categories[c] && GLOBAL.obj.categories[c].type=='batterie' && indexcategbatterie==0){
			indexcategbatterie++;
			var categ_id=c;
			//console.log('catégorie '+GLOBAL.obj.categories[c].nom);
			for ( var b in GLOBAL.obj.boxs) {
				//console.log('box '+GLOBAL.obj.boxs[b].model);
				if (GLOBAL.obj.boxs[b].model=='zwayme'){
					var box_id=b;
					GLOBAL.obj.boxs[b].get_etatbox(function(res){
						var listetat=res;
						for ( var dev in res) {
							//console.log('device '+dev);
							for ( var ins in res[dev]) {
								//console.log('instance '+ins);
								for ( var cmd in res[dev][ins]) {
									//console.log('cmd '+cmd);
									if (cmd=='commandClasse128'){
										//console.log('box'+GLOBAL.obj.boxs[box_id].id+'/'+dev +'/'+ins+' = sur batterie');
										var periph_batterie=new GLOBAL.req.periph_batterie();
										periph_batterie.nom= dev;
										periph_batterie.id="batterie_"+dev;
										periph_batterie.uuid="batterie_"+dev;
										periph_batterie.box_identifiant=dev.substring(6, 10);
										periph_batterie.box_type=ins.substring(8, 10);
										periph_batterie.box_protocole='128';
										periph_batterie.box=GLOBAL.obj.boxs[box_id]
										periph_batterie.box_id=GLOBAL.obj.boxs[box_id].id;
										periph_batterie.visibilite='visible';
										periph_batterie.ecriture_type='BATTERIE';
										periph_batterie.categorie_id=GLOBAL.obj.categories[categ_id].id
										periph_batterie.categorie=GLOBAL.obj.categories[categ_id]
										periph_batterie.ecriture_max_value='100';
										periph_batterie.ecriture_min_value='0';
										periph_batterie.tag=[];
										periph_batterie.lecture_etat_expr="($data.last.value<=$constantes.limite_batterie_faible)?$data.last.value:null";
										for ( var p in GLOBAL.obj.peripheriques) {
											if (GLOBAL.obj.peripheriques[p].box_identifiant==periph_batterie.box_identifiant){
												periph_batterie.nom=GLOBAL.obj.peripheriques[p].nom;
												periph_batterie.tag=GLOBAL.obj.peripheriques[p].tag;
											}
										}
										for (var p in GLOBAL.obj.peripheriques) {
											
											var pexistant=GLOBAL.obj.peripheriques[p];
											if (pexistant.box && pexistant.box.id==periph_batterie.box.id
													&& pexistant.box_identifiant==periph_batterie.box_identifiant){
												periphs_batterie[periph_batterie.id]=periph_batterie;
											}
										}
										
									}
								}
							}
						}
						
					});
				}
			}
			
		}
	}
	callback(periphs_batterie);
}

class_periph_batterie.charge_peripheriques_batterie=function(callback){
	GLOBAL.req.periph_batterie.generationGlobale(function(periph_batterie){
		GLOBAL.obj.peripheriques_batterie=periph_batterie;
		callback();
	});
}
class_periph_batterie.update_etat_periphbatterie=function(callback){
	GLOBAL.req.async.map(GLOBAL.obj.peripheriques_batterie,function(periph,callbackbe){
		
		periph.get_expr(function(result_json){
			GLOBAL.obj.app.core.set_last_etat(periph,result_json);		
			//console.log('-----'+periph.nom);
			callbackbe();
		});
	
  },function(err){
	  GLOBAL.obj.app.serveur.emit('periph_batterie.update_etat_periphbatterie');
	  //console.log('fin chargement etat periph de chauffe ');
	  callback();
  });
}


//class_periph_chauffage.prototype= new GLOBAL.req.events.EventEmitter();

class_periph_batterie.prototype= new GLOBAL.req.peripherique();
class_periph_batterie.prototype.constructor=class_periph_batterie;

module.exports = class_periph_batterie;