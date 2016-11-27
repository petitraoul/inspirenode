/**
 * New node file
 */
var vmc_gestion_humidite={id:7,nom:"vmc_gestion_humidite",etat:"OFF",lastrun:null};


vmc_gestion_humidite.start=function(){
	if (vmc_gestion_humidite.etat=='OFF') {
		vmc_gestion_humidite.etat='ON';
	}
}

vmc_gestion_humidite.stop=function(){
	if (vmc_gestion_humidite.etat=='ON') {
		vmc_gestion_humidite.etat='OFF';
	}
}






module.exports = vmc_gestion_humidite;