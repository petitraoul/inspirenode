/**
 * New node file
 */
var historise_etat={id:99,nom:"historise_etat",etat:"OFF",lastrun:null};
var timer=null;
historise_etat.fileattenteetat=[];
historise_etat.busy=false;

historise_etat.start=function(){
	if (historise_etat.etat=='OFF' ) {
		historise_etat.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		obj.app.serveur.on('peripherique.last_etat.added',add_etat_in_database);
		obj.app.serveur.on('peripherique.last_etat.changed',add_etat_in_database);
		obj.app.serveur.on('peripherique_chauffage.last_etat.added',add_etat_in_database);
		obj.app.serveur.on('peripherique_chauffage.last_etat.changed',add_etat_in_database);
		obj.app.serveur.on('peripherique_alarme.last_etat.added',add_etat_in_database);
		obj.app.serveur.on('peripherique_alarme.last_etat.changed',add_etat_in_database);
		historise_etat.busy=false;
		timer=setInterval(function(){
			save_fileattenteetat();	
		}, 42000);
	}
}

historise_etat.stop=function(){
	if (historise_etat.etat=='ON') {
		historise_etat.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		obj.app.serveur.removeListener('peripherique.last_etat.added',add_etat_in_database);
		obj.app.serveur.removeListener('peripherique.last_etat.changed',add_etat_in_database);
		obj.app.serveur.removeListener('peripherique_chauffage.last_etat.added',add_etat_in_database);
		obj.app.serveur.removeListener('peripherique_chauffage.last_etat.changed',add_etat_in_database);
		obj.app.serveur.removeListener('peripherique_alarme.last_etat.added',add_etat_in_database);
		obj.app.serveur.removeListener('peripherique_alarme.last_etat.changed',add_etat_in_database);
		clearInterval(timer);
	}

}

function add_etat_in_database(obj,previous_etat,new_etat_expressions,user) {
	//console.log('capture event '+JSON.stringify(new_etat_expressions));
	var timestamp=req.moment().format('YYYY-MM-DD HH:mm:ss');
	var uuid=obj.uuid;
	if (user) console.log('event historique',user.user,JSON.stringify(new_etat_expressions));
	else  console.log('event historique','system auto',JSON.stringify(new_etat_expressions));
	
	var tablemodel=GLOBAL.obj.app.core.findobj('historique','tables');
	var ordersql= 'insert into historique (';
	var colonnessql='timestamp,uuid';
	var datasql="'"+timestamp+"','"+uuid+"'";
	var okinsert=false;
	for (var c in tablemodel.colonnes){
		//console.log(tablemodel.colonnes[c].name+"_val==" +new_etat_expressions[tablemodel.colonnes[c].name+"_val"]);
		if(new_etat_expressions && (new_etat_expressions[tablemodel.colonnes[c].name] && (new_etat_expressions[tablemodel.colonnes[c].name]+"").length<30))  
		{
			//console.log('ok');
			colonnessql+=','+tablemodel.colonnes[c].name;
			datasql+=",'"+new_etat_expressions[tablemodel.colonnes[c].name]+"'";
			if (tablemodel.colonnes[c].name.indexOf('unit')<0) okinsert=true;
		} else if(new_etat_expressions && (new_etat_expressions[tablemodel.colonnes[c].name+"_val"] && (new_etat_expressions[tablemodel.colonnes[c].name+"_val"]+"").length<30))  
		{
			//console.log('ok2');
			colonnessql+=','+tablemodel.colonnes[c].name;
			datasql+=",'"+new_etat_expressions[tablemodel.colonnes[c].name+"_val"]+"'";
			if (tablemodel.colonnes[c].name.indexOf('unit')<0) okinsert=true;
		}
	}
	ordersql+=colonnessql+") values ("+datasql+");";
	if (okinsert) {
		//console.log(ordersql);
		historise_etat.fileattenteetat.push(ordersql);
	}
}

function save_fileattenteetat(){
	if (historise_etat.busy==false) {
		historise_etat.busy=true;
		var nb=0;
		//logger('INFO','historisation ','historisation_etat');
		
		GLOBAL.obj.app.db.sqltrans(historise_etat.fileattenteetat,function(nborder){
			historise_etat.fileattenteetat.splice(0,nborder);
			logger('INFO','historisation de '+nborder+' changement d états','historisation_etat');
			historise_etat.busy=false;
		});
	
		  
	}

}

module.exports = historise_etat;