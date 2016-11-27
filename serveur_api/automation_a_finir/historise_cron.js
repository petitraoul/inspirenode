/**
 * New node file
 */
var historise_cron={id:98,nom:"historise_cron",etat:"OFF",lastrun:null};
var schedule = GLOBAL.req.schedule;
GLOBAL.obj.cronhistorise=[];

historise_cron.start=function(){
	if (VR.etat=='OFF') {
		VR.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		
	}
}

historise_cron.stop=function(){
	if (VR.etat=='ON') {
		VR.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		
		//clearInterval(timer);
	}
}


var j = schedule.scheduleJob('*/5 * * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});

//  */5 * * * *
/*var j = schedule.scheduleJob('0 17 ? * 0,4-6', function(){
	
  console.log('Today is recognized by Rebecca Black!');
});*/

//j.cancel();


module.exports = historise_etat;