/**
 * New node file
 */

var class_box = function box(){
	
	var self =this;
	this.chargeByData=function(data,callback){
		for (p in data){
			var prop=data[p];
			self[p]=prop;
		}

		this.chargeById("-1",callback);
	}
	this.chargeById=function(id,callback){
		
		
		GLOBAL.req.async.series([
      		   /*chargement des data*/
      		      function(callbackd){ 
						var sql='Select * from box where id=\''+id+'\';';
						GLOBAL.obj.app.db.sqlorder(sql,
							function(rows){
								var data=rows[0];
								for (p in data){
									var prop=data[p];
									self[p]=prop;
								}
								callbackd();
							});
						},
			      function(callbackc){    
							/* {"id":"ipx800","nom":"ipx800"},
	                           {"id":"zwayme","nom":"zwayme"},
	                           		{"id":"zibase","nom":"zibase"},
	                           		{"id":"zipato","nom":"zipato"},
	                           {"id":"eco device","nom":"eco device"},
	                           		{"id":"fibaro","nom":"fibaro"},
	                           {"id":"virtuel","nom":"virtuel"},
	                           {"id":"reseau","nom":"reseau"},
	                           {"id":"sonos","nom":"sonos"},
	                           {"id":"camera","nom":"camera"}*/
							
						switch (self.model) {
						case 'ipx800':
							var comm = new GLOBAL.req.comm_with_ipx800;
							if (isNaN(self.port) || self.port=="") self.port=80;
							break;
						case 'ipxV4':
							var comm = new GLOBAL.req.comm_with_ipxV4;
							if (isNaN(self.port) || self.port=="") self.port=80;
							break;
						case 'zwayme':
							var comm = new GLOBAL.req.comm_with_zway;
							if (isNaN(self.port) || self.port=="") self.port=8083;
							break;
						case 'eco device':
							var comm = new GLOBAL.req.comm_with_eco_device;
							if (isNaN(self.port) || self.port=="") self.port=80;
							
							break;
						case 'virtuel':
							var comm = new GLOBAL.req.comm_with_virtuel;
							break;
						case 'inspirenode_box':
							var comm = new GLOBAL.req.comm_with_inspirenode_box;
							break;
						case 'inspirenode_periph':
							var comm = new GLOBAL.req.comm_with_inspirenode_periph;
							break;
						case 'infoOS':
							var comm = new GLOBAL.req.comm_with_infoOS;
							break;
						case 'onduleur':
							var comm = new GLOBAL.req.comm_with_onduleur;
							break;
						case 'sonos':
							var comm = new GLOBAL.req.comm_with_sonos;
							break;
						case 'cameraipfoscam':
							var comm = new GLOBAL.req.comm_with_cameraipfoscam;
							if (isNaN(self.port) || self.port=="") self.port=81;
							break;
						case 'cameradomesony':
							var comm = new GLOBAL.req.comm_with_cameradomesony;
							if (isNaN(self.port) || self.port=="") self.port=80;
							break;
						case 'i2c':
							var comm = new GLOBAL.req.comm_with_i2c;
							break;
						case 'modbus':
							var comm = new GLOBAL.req.comm_with_modbus;
							break;
						case 'modbuscoils':
							var comm = new GLOBAL.req.comm_with_modbuscoils;
							break;
						case 'modbusinteger':
							var comm = new GLOBAL.req.comm_with_modbusinteger;
							break;
						case 'modbus_real':
							var comm = new GLOBAL.req.comm_with_modbus_real;
							break;
						case 'domoticz':
							var comm = new GLOBAL.req.comm_with_domoticz;
							if (isNaN(self.port) || self.port=="") self.port=8080;
							break;	
						case 'arduino_pwm':
							var comm = new GLOBAL.req.comm_with_arduino_pwm;
							break;		
						case 'arduino_meteo':
							var comm = new GLOBAL.req.comm_with_arduino_meteo;
							break;
						default:
							var comm = new GLOBAL.req.comm_with_virtuel;
							break;
						}  

						self.get_etatbox=comm.get_etatbox;
						self.get_etat=comm.get_etat;
						self.filtre_etat=comm.filtre_etat;
						self.set_etat=comm.set_etat;
						self.arrangereponsebox=comm.arrangereponsebox;
						self.forceUpdateBox=comm.forceUpdateBox;
						
						callbackc();
				      },
				      function(callbackip){
				  		if (self['ip']){
							GLOBAL.req.comm.getipfromid(self.ip,function(body){
								self.ip=body;
								callbackip();
							})
						} else {
							callbackip();
						}
				      }]
		, function(err) { //This is the final callback
			
            //console.log(JSON.stringify(self));
            GLOBAL.obj.app.serveur.emit('box.load',self);
            callback(null,self);
        });
	}

}


class_box.charge_boxs=function(callback){
  	  var sql='Select * from box c;';
	  GLOBAL.obj.app.db.sqlorder(sql,
		function(rows){
		  GLOBAL.req.async.map(rows,function(box,callbacktt){
			  var t= new GLOBAL.req.box();
			  t.chargeById(box.id,callbacktt);
		  },function(err,boxs){
			  GLOBAL.obj.boxs=boxs;
			  GLOBAL.obj.app.serveur.emit('box.charge_boxs');
			  callback();
		  })
		});
	}

class_box.update_etat_boxs=function(callback){
	//console.log('*************************Boucle chargement etat box');
	GLOBAL.req.async.map(GLOBAL.obj.boxs,function(box,callbackbe){
		var callbacked=false;
		var boxtimeout=setTimeout(function(){
			callbacked=true;
			callbackbe();
		},15000);
		box.get_etatbox(function(res){
			//console.log('d�but chargement etat box '+box.nom);
			box.last_etat=res;
			GLOBAL.obj.app.serveur.emit('box.update_etat_box',box);
			clearTimeout(boxtimeout);
			if (callbacked==false) callbackbe();
		});
	  },function(err){
		 GLOBAL.obj.app.serveur.emit('box.update_etat_boxs');
		 //console.log('chargement etat box termin�');
		 callback();
	  });

	
}
//class_categorie.prototype= new GLOBAL.req.events.EventEmitter();
module.exports = class_box;