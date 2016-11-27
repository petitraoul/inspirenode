/**
 * New node file
 */
var alarme_simulation_presence={id:8,nom:"alarme_simulation_presence",etat:"OFF",lastrun:null};


alarme_simulation_presence.start=function(){
	if (alarme_simulation_presence.etat=='OFF') {
		alarme_simulation_presence.etat='ON';
	}
}

alarme_simulation_presence.stop=function(){
	if (alarme_simulation_presence.etat=='ON') {
		alarme_simulation_presence.etat='OFF';
	}
}






module.exports = alarme_simulation_presence;