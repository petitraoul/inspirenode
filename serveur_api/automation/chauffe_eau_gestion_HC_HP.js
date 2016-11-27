/**
 * New node file
 */
var chauffe_eau_gestion_HC_HP={id:18,nom:"chauffe_eau_gestion_HC_HP",etat:"OFF",lastrun:null};
var timer=null;

chauffe_eau_gestion_HC_HP.start=function(){
	if (chauffe_eau_gestion_HC_HP.etat=='OFF') {
		chauffe_eau_gestion_HC_HP.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		timer=setInterval(function(){
			controleChauffeEau();
		}, 60000);
		//controleChauffeEau();
	}
}

chauffe_eau_gestion_HC_HP.stop=function(){
	if (chauffe_eau_gestion_HC_HP.etat=='ON') {
		chauffe_eau_gestion_HC_HP.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		
		clearInterval(timer);
	}
}

function controleChauffeEau(){
	chauffe_eau_gestion_HC_HP.lastrun=req.moment().format('DD/MM/YY HH:mm:ss');	
	var heure=parseInt(req.moment().format('HH'));
	var minutes=parseInt(req.moment().format('mm'));
	var id_chauffeeau=160;
	var periph_chauffeeau=obj.app.core.findobj(id_chauffeeau,'peripheriques');
	
	if (periph_chauffeeau.last_etat && periph_chauffeeau.last_etat.expression ) {
		var etatactuel = periph_chauffeeau.last_etat.expression.etat;
		if (etatactuel==0 && heure==0 && minutes<5) {
			periph_chauffeeau.box.set_etat(periph_chauffeeau,'ON',null,function(){});
		}
		if (etatactuel==1 && heure==7 && minutes<5) {
			periph_chauffeeau.box.set_etat(periph_chauffeeau,'OFF',null,function(){});
		}
		
	}
	
}


module.exports = chauffe_eau_gestion_HC_HP;