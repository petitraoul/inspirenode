/**
 * New node file
 */
var zz_test_clignotage_lampes={id:10,nom:"zz_test_clignotage_lampes",etat:"OFF",lastrun:null};
var timer=null;

var lampes=[169,170,168];
var lampes_switch={};

zz_test_clignotage_lampes.start=function(){
	if (zz_test_clignotage_lampes.etat=='OFF') {
		zz_test_clignotage_lampes.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		timer=setInterval(inverse_etat_lampe,1000);
	}
}

zz_test_clignotage_lampes.stop=function(){
	if (zz_test_clignotage_lampes.etat=='ON') {
		zz_test_clignotage_lampes.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		clearInterval(timer);
	}
}

function inverse_etat_lampe(){
	for(var id in lampes){
		
		var lampe=obj.app.core.findobj(lampes[id],'peripheriques');
		if (lampe.last_etat) {
			if (lampes_switch[lampe.uuid] && lampes_switch[lampe.uuid]=='OFF') {
				console.log("clignote lampe "+lampe.nom +" --> ON");
				lampes_switch[lampe.uuid]='ON';
				lampe.box.set_etat(lampe,'ON',null,function(){});
			} else {
				console.log("clignote lampe "+lampe.nom +" --> OFF");
				lampes_switch[lampe.uuid]='OFF';
				lampe.box.set_etat(lampe,'OFF',null,function(){});
			}			
		}
	}
}




module.exports = zz_test_clignotage_lampes;