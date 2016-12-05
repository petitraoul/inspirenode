/**
 * New node file
 */
var aire_voyage_alertes={id:41,nom:"aire_voyage_alertes",etat:"OFF",lastrun:null};
var timer=null;


aire_voyage_alertes.start=function(){
	if (aire_voyage_alertes.etat=='OFF') {
		aire_voyage_alertes.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		/*obj.app.serveur.on('core_charge_all',run_update_etat);
		obj.app.serveur.on('box.update_etat_box',actions_on_event1);
		obj.app.serveur.on('box.update_etat_boxs',actions_on_event2);
		
		/*Execution toutes les  30 secondes*/
		/*timer=setInterval(function(){
				run_update_etat();
			}, 30000);
		
		run_update_etat();	*/
	}
}

aire_voyage_alertes.stop=function(){
	if (aire_voyage_calcul_sejour.etat=='ON') {
		aire_voyage_calcul_sejour.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		/*obj.app.serveur.removeListener('core_charge_all',actions_on_event1);
		obj.app.serveur.removeListener('box.update_etat_box',actions_on_event1);
		obj.app.serveur.removeListener('box.update_etat_boxs',actions_on_event2);
		clearInterval(timer);*/
	}

}

module.exports = aire_voyage_alertes;