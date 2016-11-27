/**
 * New node file
 */

/*
mystr = (17).toString(2);
pad = '0000000000000000';
bin=(pad + mystr).slice(-pad.length);
console.log(bin);
//renvoi 00000000010000
var bitdroite=1
console.log(bin.substr(15-bitdroite,1)); //dernier bit
*/



var modbus = function(adresseip) {
	this.adresseip=adresseip;
		
	this.set_etat=function(periph,cmd,val,callbackfunc){		    
		var self=this;
		
		var self=this;
		var client = GLOBAL.req.jsmodbus.client.tcp.complete({ 
	        'host'              : self.ip, //test 192.168.1.249
	        'port'              : self.port, // defaut 502
	        'autoReconnect'     : true,
	        'logLevel'      	: 'debug',
	        'reconnectTimeout'  : 1000,
	        'timeout'           : 5000,
	        'unitId'            : 1
	    });
		client.connect();
		var closed=false;
		var rep={};
		rep.cmd=cmd;
		rep.val=val;
		var closed=false;
		setTimeout(function(){
			if (!closed){
			  try {
				  
				  client.close();
				} catch (e) {
				}
				logger('ERROR',{nom:self.nom,id:self.id,msg:"set etat box modbus Timeout:"},'box_modbus');
			   callbackfunc({rep:rep,'error':'timeout'});
			}
		},29000);
		client.on('error', function (err) {
			logger('ERROR',{nom:self.nom,id:self.id,msg:"set etat box modbus Error:",error:err},'box_modbus');
		})
		
		client.on('connect', function () {
				    // make some calls
					logger('INFO',{nom:self.nom,id:self.id,msg:"set etat box modbus connect:"},'box_modbus');
					
						switch (cmd) {
						case 'ON':
							if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_max_value;
							break;
						case 'OFF':
							if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_min_value;
							break;

						case 'UP':
							if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_max_value;
							break;
						case 'DOWN':
							if (val!=periph.ecriture_max_value && val!=periph.ecriture_min_value) val=periph.ecriture_min_value;
							break;
						default:
							break;
						}
						logger('INFO',{nom:self.nom,id:self.id,msg:"write registre modbus:",val:val,cmd:cmd},'box_modbus');
						var registre=[];
						try {
							var reste=Number(val);
							for (var i=Number(periph.box_type);i>0;i--){
	
								var nb=Math.floor(reste/65536);
								if (!nb) { nb=0;}
								registre.unshift(nb);
								reste=reste%nb;
								//console.log(i,reste,nb,registre);
							}							
						} catch (e) {
							logger('ERROR',{nom:self.nom,id:self.id,msg:"probleme creation tableau registre modbus:",registre:registre,val:val,cmd:cmd},'box_modbus');
							
						}

						//console.log(registre);
						logger('INFO',{nom:self.nom,id:self.id,msg:"write registre modbus:",registre:registre},'box_modbus');
						
						write(client,periph.box_identifiant,val,periph.box_protocole,function(resultbox){
							rep.result=resultbox;
							callbackfunc(rep);
							closed=true;
							try {
								client.close();
						    } catch (e) {}
						});
		});

		
	}
	
	this.get_etatbox=function(callbackfunc){
		var self=this;
		var client = GLOBAL.req.jsmodbus.client.tcp.complete({ 
	        'host'              : self.ip, //test 192.168.1.249
	        'port'              : self.port, // defaut 502
	        'autoReconnect'     : true,
	        'logLevel'      	: 'debug',
	        'reconnectTimeout'  : 1000,
	        'timeout'           : 5000,
	        'unitId'            : 1
	    });
		
		var sql='Select id,box_id,box_identifiant,box_protocole,box_type from peripherique where box_id='+self.id+';';
		//console.log(sql);
		GLOBAL.obj.app.db.sqlorder(sql,
			function(rows){
				var res={};
				client.connect();
				var closed=false;
				setTimeout(function(){
					if (!closed){
					  try {
						  
						  client.close();
						} catch (e) {
						}
						logger('ERROR',{nom:self.nom,id:self.id,msg:"get etat box modbus Timeout:"},'box_modbus');
					   callbackfunc({'error':'timeout'});
					}
				},29000);
				client.on('error', function (err) {
					logger('ERROR',{nom:self.nom,id:self.id,msg:"get etat box modbus Error:",error:err},'box_modbus');
				})
				client.on('connect', function () {
				    // make some calls
					logger('INFO',{nom:self.nom,id:self.id,msg:"get etat box modbus connect:"},'box_modbus');
					GLOBAL.req.async.map(rows,function(row_periph,callbackb){
						logger('INFO',{nom:self.nom,id:self.id,msg:"read registre modbus:",row_periph:row_periph},'box_modbus');
						read(client,row_periph.box_identifiant,row_periph.box_type,row_periph.box_protocole,function(resultbox){
							
							res['reg_'+resultbox.registre_deb]={etat:resultbox.result};
							callbackb();
						});
					  },function(err){
						  closed=true;
						  try {
							  client.close();
							} catch (e) {
							}
						  callbackfunc(res);
						  logger('INFO',{nom:self.nom,id:self.id,msg:"get etat box modbus read:",result:res},'box_modbus');
					  });
				});
				
				//if (rows.length<22)
				//	console.log(ir);
			
				//if (rows.length<11) console.log('box_id:'+self.id,'nbrows:'+rows.length,'nbrowsbis:'+rowsbis.length,res,rows);
				
			});
	}
	
	
	this.get_etat=function(callbackfunc,obj_peripherique,etatbox){
		var self=this;
		if (!etatbox && !self.last_etat) {			
			etatbox=this.get_etatbox(function(etatboxres){
				self.filtre_etat(callbackfunc,obj_peripherique,etatboxres);
			});
		} else if (!etatbox){
			self.filtre_etat(callbackfunc,obj_peripherique,self.last_etat);
		} else {
			self.filtre_etat(callbackfunc,obj_peripherique,etatbox);
		}
	}
	
	this.filtre_etat=function(callbackfunc,periph,etatbox){
		var res=etatbox;
		if (etatbox[periph.box_identifiant]) {
			res=etatbox['reg_'+periph.box_identifiant];
			
		}
		if (!res) res= {};
		res.constantes=etatbox.constantes;
		callbackfunc(periph,res);
	}
}


var read= function (client,registre_deb,taille_registre,bit,callback) {
	// adresse du registre en decimal , nombre de mot
	client.readHoldingRegisters(registre_deb, taille_registre,callback).then(function (resp) {

	    // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ] }
	    //console.log(resp); 
		//console.log(resp.register);
		var pas;
		var coeff = 1;
		var result=0;
		if (taille_registre >= 2){
			//console.log(taille_registre);
			for (pas = taille_registre-2; pas >= 0; pas--) {
				//console.log('pas :'+pas);
				coeff = coeff *65536;
				//console.log('coeff :'+coeff);
				result = resp.register[pas]*coeff+result;
				//console.log(result);
			}
		}
		result = result + resp.register[taille_registre-1]
		var keyetat=registre_deb;
		if((bit+"")!=""){
			//console.log("choix bit: "+bit);			
			//console.log(result);
			result=parseInt(result);
			mystr = result.toString(2);
			pad = '0000000000000000';
			bin=(pad + mystr).slice(-pad.length);
			//console.log(bin);
			//renvoi 00000000010000
			bit=parseInt(bit);
			var bitdroite=bit;
			result=bin.substr(15-bitdroite,1);
			//console.log(result);
			//dernier bit
			keyetat=keyetat+'_'+bit;
		}
		
		callback({registre_deb:keyetat,taille_registre:taille_registre,result:result});
		//client.close();
		//console.log('client close');
	}).fail(console.log);
}

/*var write= function (client,registre_deb,registre,binaire,callback) {
	console.log("ecriture adresse: "+registre_deb);
	console.log("ecriture valeur: "+registre);
	// adresse du registre en decimal , nombre de mot
	if((binaire+"")==""){
		
	}
	client.writeMultipleRegisters(registre_deb, registre,callback).then(function (resp) {
		var result={};
	    // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ] }
	    console.log(resp); 
		console.log(resp.register);
		if (registre_deb==resp.startAddress){
			result.status='resultat : ok';
		}else{
			result.status='resultat : erreur';
		}
		result.resp=resp;
		client.close();
		
		callback({registre_deb:registre_deb,registre:registre,result:result});
		//client.close();
		//console.log('client close');
	}).fail(console.log);
}*/
var write= function (client,registre_deb,valeur,binaire,callback) {
	console.log("ecriture adresse: "+registre_deb);
	console.log("ecriture valeur: "+valeur);
	// adresse du registre en decimal , nombre de mot
	if((binaire+"")==""){
		valeur=valeur*10;
		console.log("ecriture valeur: "+valeur);
	}
	var registre = [valeur];
	console.log("ecriture valeur: "+registre);
	client.writeMultipleRegisters(registre_deb, registre,callback).then(function (resp) {
		var result={};
	    // resp will look like { fc: 3, byteCount: 20, register: [ values 0 - 10 ] }
	    console.log(resp); 
		console.log(resp.register);
		if (registre_deb==resp.startAddress){
			result.status='resultat : ok';
		}else{
			result.status='resultat : erreur';
		}
		result.resp=resp;
		client.close();
		
		callback({registre_deb:registre_deb,registre:registre,result:result});
		//client.close();
		//console.log('client close');
	}).fail(console.log);
}
module.exports = modbus;
