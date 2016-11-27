var acces_porte_ecoute={id:52,nom:"acces_porte_ecoute",etat:"ON",lastrun:null};

/*---------------clavier   0 , 1 , 2    */
var numclavier_periphid=[null,'2','3'];
var arduinoSerialPort = '/dev/ttyACM0';	//Port s�rie par connexion USB entre le Raspberry Pi et l�Arduino

var typecode_colonnessql=[null,'badge_numero','codeacces']; 
var serialport = GLOBAL.req.serialport;
var SerialPort ;
var sp 
var reboot = "0";
var init = "0";

acces_porte_ecoute.start=function(){
	acces_porte_ecoute.etat='ON';
	
}

acces_porte_ecoute.stop=function(){
	acces_porte_ecoute.etat='ON';
	
}

/*setInterval(function(){
	console.log('test');
	traitemessagearduino('1234567890;1;1');
	//IsItOpenHour(GLOBAL.req.moment(),'2');
},6000);

setInterval(function(){
	traitemessagearduino('24335;2;1');
},5000);*/


try {
	SerialPort= serialport.SerialPort;
	sp = new SerialPort(arduinoSerialPort, {
      baudrate: 9600,parser: serialport.parsers.readline('\n')
	});
} catch (e) {
	logger('ERROR',{msg:'Impossible de creer l objet serialport',error:e},'arduino_acces');		
}

setInterval(function(){

	if (reboot ==1 && init==1){
		logger('WARNING',{msg:'Redémarrage communication avec arduino'},'arduino_acces');
  		
		//console.log("redémarrage"); 
		try {
			SerialPort= serialport.SerialPort;
			sp = new SerialPort(arduinoSerialPort, {
		      baudrate: 9600,parser: serialport.parsers.readline('\n')
			});
		} catch (e) {
			logger('ERROR',{msg:'Impossible de creer l objet serialport',error:e},'arduino_acces');		
		}
		//console.log("Starting up serial host...");
		read();
		surveillance();
	}
	if (init==0){
		logger('WARNING',{msg:'Démarrage communication avec arduino'},'arduino_acces');
  		
		read();
		surveillance();
		init=1;
	}
}
, 1000);


// fonction read
// retourne la valeur saisie sur le clavier avec 3 param�tres s�par�s par un ; (point virgule)
// parametre 1 = code carte ou saisie
// parametre 2 = type de code (1=carte, 2 = saisie)
// parametre 3 = numéro du clavier (1=clavier 1, 2 = clavier 2)
// 
function read() {

	      //console.log('Lecture arduino');
		  logger('INFO',{msg:'demarrage ecoute arduino',nom:this.nom},'arduino_acces');
		  reboot = "0";
		  try {
	          sp.on('data', function (data) {
	        	  traitemessagearduino(data);
	          });
		   } catch (e) {
			   init=1;
			   logger('ERROR',{msg:'Impossible de s inscrire a l evenement on Data',error:e},'arduino_acces');		
			   setTimeout(function (){reboot = "1";},10000);
		   }

}

function traitemessagearduino(data){
	  if (data) {
		  //console.log(data.toString());
		  logger('INFO',{msg:'donnees recues',data:data},'arduino_acces');
		  var message = data.toString().split('\r')[0].split(';');
		  if(message.length==3){
			  var code=message[0];
			  var type=message[1];
			  var numeroclavier=message[2];
			  var sql="select 'OK' rep,u.nom,u.prenom,u.email,datetime('now','localtime') datetimereq,u.type,r.salle" +
			  		" from peripherique p inner join peripherique_tag pt on pt.id_peripherique=p.id" +
			  		"    inner join tag t on t.id=pt.id_tag" +
			  		"    inner join reservations r on r.salle=t.id" +
			  		"    inner join utilisateurs u on u.id=r.clientid" +
			  		" where ((datetime('now','localtime')>=datetime(r.start)" +
			  		"  and datetime('now','localtime')<=datetime(r.end)" +
			  		"   and etat='ACTIF'" +
			  		"   and supprime='N')) ";
			  
			  		if (typecode_colonnessql[type]=='badge_numero'){
			  			sql+= " and date(badge_abonnement_date_fin)>=datetime('now','localtime')";
			  		}			  		
			  		sql+="   and "+typecode_colonnessql[type]+"=?"+
			  		     "   and p.id=?";
			  		sql+="union all select 'OK' rep,u.nom,u.prenom,u.email,datetime('now','localtime') datetimereq,u.type,null salle"+
			  		" from utilisateurs u where (u.type='ADMINISTRATEUR' or u.type='SERVICE')";
			  		if (typecode_colonnessql[type]=='badge_numero'){
			  			sql+= " and (date(badge_abonnement_date_fin)>=datetime('now','localtime') " +
			  					" or badge_abonnement_date_fin  ='' or badge_abonnement_date_fin is null)";
			  		}			  		
			  		sql+="   and "+typecode_colonnessql[type]+"=?";
			  		sql+= ";";
			  var params=[code+'',numclavier_periphid[numeroclavier]+'',code+''];
			  //console.log(sql);
			  //console.log(params);
			  logger('INFO',{msg:'donnees traduites',id_periph:numclavier_periphid[numeroclavier],type:typecode_colonnessql[type],code:code},'arduino_acces');
			  
			  GLOBAL.obj.app.db.sqlorder(sql,function(rows){
				  logger('INFO',{msg:'verification result',result:rows},'arduino_acces');
				  //console.log('retour rows',rows);
				  if(rows && rows[0] && rows[0]['rep']=='OK'){
					 var periph=GLOBAL.obj.app.core.findobj(numclavier_periphid[numeroclavier],'peripheriques');
					 logger('INFO',{msg:'acces accepté'},'arduino_acces');	
					 if (IsItOpenHour(rows[0]['datetimereq'],rows[0]['salle']) 
							 || rows[0]['type']=='ADMINISTRATEUR'
							 || rows[0]['type']=='SERVICE') {
						
						 periph.set_etat('ON',null,function(){
							 //console.log('open door');
							 logger('INFO',{msg:'ouverture'},'arduino_acces');
						 });
						 
						 setTimeout(function (){
							 periph.set_etat('OFF',null,function(){
								 //console.log('close door');
								logger('INFO',{msg:'fermeture'},'arduino_acces');
							});
						 },4000);		
						 
					 }
					 

					 
				  } else {
					  logger('WARNING',{msg:'acces refusé'},'arduino_acces');
				  }     			  
				},params);
			  
		  } else {
			  logger('ERROR',{msg:'donnees incorrectes car # 3 valeurs',message:message,data:data},'arduino_acces');
		  }
	  }
}
function IsItOpenHour(vcontrolDateTime,salleselected){
	var params=GLOBAL.obj.parametres;
	var rep=[];
	//console.log('requete','start',variables.start,'end',variables.end,variables._);
	var horaires=[];
	if (salleselected && params['params_'+salleselected]) {
		horaires=params['params_'+salleselected].params_dispolist;
	}
		
	var controlday=GLOBAL.req.moment(vcontrolDateTime, "YYYY-MM-DD HH:mm:ss");
	
		var daynum=controlday.day();
		//console.log(daynum);

		var horairesforthisday=[];
		
		for (var dh in horaires){					
			var horaire={start:GLOBAL.req.moment("01/01/1970 "+horaires[dh].start,"DD/MM/YYYY HH:mm"),
					end:GLOBAL.req.moment("01/01/1970 "+horaires[dh].end,"DD/MM/YYYY HH:mm"),
					dow:horaires[dh].dow}
			for (var d in horaire.dow){
				if (""+horaire.dow[d]==daynum){
					horairesforthisday.push(horaire);
				}
			}
		}
		
		function comparehoraire(a,b) {
			  if (a.start < b.start)
			    return -1;
			  else if (a.start > b.start)
			    return 1;
			  else 
			    return 0;
		}
		horairesforthisday.sort(comparehoraire);
		
		var isOpen=false;
		for (var h in horairesforthisday){
			
			var opentime={
			        start: GLOBAL.req.moment(controlday.format("YYYY-MM-DD")+" "+horairesforthisday[h].start.format('HH:mm:ss'),"YYYY-MM-DD HH:mm:ss"),
			        end: GLOBAL.req.moment(controlday.format("YYYY-MM-DD")+" "+horairesforthisday[h].end.format('HH:mm:ss'),"YYYY-MM-DD HH:mm:ss"),
			    }
			
			var diffstart=controlday.diff(opentime.start);
			
			var diffend=controlday.diff(opentime.end);
			if (diffstart>0 && diffend<0) {
				isOpen=true;
			} 
			
			
		}
		
	//console.log('isOpen',isOpen);
	return isOpen;
	
}

function surveillance() {	
	try{
		sp.on('close', function () {
			logger('WARNING',{msg:'evenement close communication avec arduino'},'arduino_acces');
  		  
			setTimeout(function (){reboot = "1";},10000);
		});
		sp.on('error', function () {
			logger('ERROR',{msg:'evenement error communication avec arduino'},'arduino_acces');
	  		  
			
			setTimeout(function (){reboot = "1";},10000);
		});
		sp.on('disconnect', function () {
			logger('WARNING',{msg:'evenement disconnect communication avec arduino'},'arduino_acces');
	  		
			setTimeout(function (){reboot = "1";},10000);
		});
	} catch (e) {
		   init=1;
		   setTimeout(function (){reboot = "1";},10000);
		   logger('ERROR',{msg:'Impossible de s inscrire a l evenement on close,error,disconnect',error:e},'arduino_acces');		
	
	}
}



module.exports = acces_porte_ecoute;