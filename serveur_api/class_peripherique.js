/**
 * New node file
 */


var class_peripherique = function peripherique(){
	
	var self =this;
	
	self.get_etatbox=function(callback){
		self =this;
		self.box.get_etatbox(callback);
	}
	self.get_etat=function(callback){
		self =this;
		if (self.box) {
			self.box.get_etat(function(periph,result){	
					var res=result;
					if (!res) res={};
					res.constantes={};
					for (var c in GLOBAL.obj.constantes){
						var co=GLOBAL.obj.constantes[c];
						res.constantes[co.code]=co.valeur;
					}
					callback(periph,res);
				},self);			
		} else {
			callback(self,{});
		}

	}
	
	self.set_etat=function(cmd,val,callback,originesetetat,user){
		self =this;
		/*console.log(self.uuid +" =>"+cmd+" ="+val);
		if (self.last_etat && self.last_etat.expression){
			console.log(self.uuid +" : "+self.last_etat.expression.etat);
		}*/
		
		logger('DEBUG',{msg:'Set_last_etat peripherique.js',nom:obj.nom,id:obj.id,originesetetat:originesetetat,new_etat:new_etat+ ' , ' + self.last_etat.expression},'changement_etat');

		function setON(id,callback){
			//console.log('ON '+id);
			if (!callback) callback=function(){};
			var periph=GLOBAL.obj.app.core.findobj(id,'peripheriques');
			GLOBAL.obj.app.core.findobj(id,'peripheriques').set_etat('ON',periph.ecriture_max_value,callback,originesetetat,user);
		}
		function setOFF(id,callback){
			//console.log('OFF '+id);
			if (!callback) callback=function(){};
			var periph=GLOBAL.obj.app.core.findobj(id,'peripheriques');
			GLOBAL.obj.app.core.findobj(id,'peripheriques').set_etat('OFF',periph.ecriture_min_value,callback,originesetetat,user);
		}
		function setUP(id,callback){
			//console.log('UP '+id);
			if (!callback) callback=function(){};
			var periph=GLOBAL.obj.app.core.findobj(id,'peripheriques');
			GLOBAL.obj.app.core.findobj(id,'peripheriques').set_etat('UP',periph.ecriture_max_value,callback,originesetetat,user);
		}
		function setDOWN(id,callback){
			//console.log('DOWN '+id);
			if (!callback) callback=function(){};
			var periph=GLOBAL.obj.app.core.findobj(id,'peripheriques');
			GLOBAL.obj.app.core.findobj(id,'peripheriques').set_etat('DOWN',periph.ecriture_min_value,callback,originesetetat,user);
		}
		function setDIM(id,val,callback){
			//console.log('DIM '+val + ' '+id);
			if (!callback) callback=function(){};
			GLOBAL.obj.app.core.findobj(id,'peripheriques').set_etat('DIM',val,callback,originesetetat,user);
		}
		function setAutomationON(id){
			var automat=GLOBAL.obj.app.core.findobj(id,'automation');
			if (automat) automat.start();
		}
		function setAutomationOFF(id){
			var automat=GLOBAL.obj.app.core.findobj(id,'automation');
			automat.stop();
		}
		var valm=val;
		if (cmd=='ON' || cmd=='UP') {if(self.ecriture_max_value) valm=self.ecriture_max_value; else valm=1;}
		if (cmd=='OFF' || cmd=='DOWN' || cmd=='STOP') {if(self.ecriture_min_value) valm=self.ecriture_min_value; else valm=0;}		
		

		
		var new_etat={};
		if (self.last_etat && self.last_etat.expression)
			new_etat=JSON.parse(JSON.stringify(self.last_etat.expression));
		
		new_etat.etat=valm;
		
		self.set_etat_box(self,cmd,valm,new_etat,originesetetat,user,callback);
				
		
		if (cmd=='ON' && self.ecriture_etat_ON && self.ecriture_etat_ON+""!=""){
			eval(self.ecriture_etat_ON);
		}
		if ((cmd=='OFF' || cmd=='STOP') && self.ecriture_etat_OFF && self.ecriture_etat_OFF+""!=""){
			eval(self.ecriture_etat_OFF);
		}
		if (cmd=='DIM' && self.ecriture_etat_DIM && self.ecriture_etat_DIM+""!=""){
			eval(self.ecriture_etat_DIM);
		}
		if (cmd=='UP' && self.ecriture_etat_UP && self.ecriture_etat_UP+""!=""){
			eval(self.ecriture_etat_UP);
		}
		if (cmd=='DOWN' && self.ecriture_etat_DOWN && self.ecriture_etat_DOWN+""!=""){
			eval(self.ecriture_etat_DOWN);
		}

	}
	
	self.set_etat_box=function(self,cmd,valm,new_etat,originesetetat,user,callback){
		self.box.set_etat(self,cmd,valm,function(majetat){
			if (majetat==false) {
				
			} else {
				GLOBAL.obj.app.core.set_last_etat(self,new_etat,originesetetat,user);
			}
			if (callback) callback();
		});
	}
	
	self.get_expr=function(callback){
		self =this;

		self.get_etat(function(p,result){
			//console.error(p.id,result);
			result.expr=function(expr){
				var round=function(number,nbdec){
					var p=Math.pow(10,nbdec);
					return Math.round(number*p)/p;
				}
				var to_date= function (timestamp){
					var datetime=new Date();
					datetime.setTime( timestamp - datetime.getTimezoneOffset()*60*1000 );
					return datetime;
				}
				var to_datefr= function (timestamp){
					var datetime=to_date(timestamp);
					var yyyy = datetime.getUTCFullYear();
					var mm = datetime.getUTCMonth()+1;
					var dd = datetime.getUTCDate();
					var hh = datetime.getUTCHours();
					var mi = datetime.getUTCMinutes();
					var ss = datetime.getUTCSeconds();
					return dd+'/'+mm+' '+hh+':'+mi;
				}
				var moyenne=function(array_obj,propertie){
					var sum_val=0;
					var nb_val=0;
					for (var s in array_obj){
						var v=array_obj[s]['expression'][propertie];
						if (!isNaN(v)){
							sum_val+=v;
							nb_val++;
						}
					}
					if (nb_val>0) {
						return sum_val/ nb_val;
					} else {
						return null;
					}
					
				}				
				var res="";
				try {
					if (expr) {
						var exprs=expr.split('$').join("this.");
						res=eval(exprs);								
					}
				} catch (e) {
					res=expr +" ==> "+e.type + " : "+ e.message;
				}
				if (res+""=="" && expr && expr!="") {res=""};
				return res;};
			if (result.erreur=="manque_etat_enfant") {
				callback(null);
			} else {
				res={};
				
				res.etat=result.expr(self.lecture_etat_expr);
				res.etat_unit=result.expr(self.lecture_compl_hist);
				res.expr1_val=result.expr(self.lecture_expr1);
				res.expr1_unit=result.expr(self.lecture_expr1_unit);
				res.expr2_val=result.expr(self.lecture_expr2);
				res.expr2_unit=result.expr(self.lecture_expr2_unit);
				res.expr3_val=result.expr(self.lecture_expr3);
				res.expr3_unit=result.expr(self.lecture_expr3_unit);
				res.expr4_val=result.expr(self.lecture_expr4);
				res.expr4_unit=result.expr(self.lecture_expr4_unit);
				res.expr5_val=result.expr(self.lecture_expr5);
				res.expr5_unit=result.expr(self.lecture_expr5_unit);
				res.expr6_val=result.expr(self.lecture_expr6);
				res.expr6_unit=result.expr(self.lecture_expr6_unit);
				res.expr7_val=result.expr(self.lecture_expr7);
				res.expr7_unit=result.expr(self.lecture_expr7_unit);
				res.etat2=result.expr(self.etat2);
				
				callback(res);
			}


		});
	}
	self.chargeByData=function(data,callback){
		for (var p in data){
			var prop=data[p];
			self[p]=prop;
		}
		this.chargeById("-1",callback);
	}
	self.chargeById=function(id,callback){
		
		GLOBAL.req.async.series([
		   /*chargement des data*/
		      function(callbackd){ 
		    	  
		    	  var sql='Select * from peripherique where id=\''+id+'\';';
		    	  GLOBAL.obj.app.db.sqlorder(sql,
					function(rows){
						var data=rows[0];
						for (var p in data){
							var prop=data[p];
							self[p]=prop;
						}
						callbackd();
					});
		      },
		    /*chargement categorie*/
		      function(callbackc){    
		    	  self.categorie=GLOBAL.obj.app.core.findobj(self.categorie_id,'categories');
		    	  callbackc();
			      },
			/*chargement box*/
		      function(callbackb){    
			      self.box=GLOBAL.obj.app.core.findobj(self.box_id,'boxs');
		    	  callbackb();
			      },
			/*chargement tags*/
		      function(callbackt){    
			    	  var sql='Select * from tag t where exists (select 1 from peripherique_tag l where l.id_tag=t.id and l.id_peripherique=\''+id+'\');';
			    	  
			    	  GLOBAL.obj.app.db.sqlorder(sql,
						function(rows){
			    		  GLOBAL.req.async.map(rows,function(tag,callbacktt){
			    			  /*var t= new GLOBAL.req.tag();
			    			  t.chargeById(tag.id,callbacktt);*/
						      var t=GLOBAL.obj.app.core.findobj(tag.id,'tags');
						      callbacktt(null,t);
			    		  },function(err,tags){
			    			  self.tag=tags;
			    			  callbackt();
			    		  })
						});
			      },
		      
        ], function(err) { //This is the final callback
			
            //console.log(JSON.stringify(self));
			//GLOBAL.obj.app.serveur.emit('peripherique.charge_peripherique',self);
            //GLOBAL.obj.app.serveur.emit('periph_load',self);
            callback(null,self);
        });
	}
	
}

class_peripherique.charge_peripheriques=function(callback){
	  var sql='Select * from peripherique p;';
	  GLOBAL.obj.app.db.sqlorder(sql,
		function(rows){
		  GLOBAL.req.async.map(rows,function(periph,callbacktt){
			  var t= new GLOBAL.req.peripherique();
			  t.chargeById(periph.id,callbacktt);
		  },function(err,peripheriques){
	
			  GLOBAL.obj.peripheriques=peripheriques;
			  GLOBAL.obj.app.serveur.emit('peripherique.charge_peripheriques');
			  callback();
		  })
		});
	}


class_peripherique.update_etat_periph_of_box=function(box,callback,originesetetat){
	
	GLOBAL.req.async.map(GLOBAL.obj.peripheriques,function(periph,callbackbe){
		if (periph.box_id==box.id){
			periph.get_expr(function(result_json){
				GLOBAL.obj.app.core.set_last_etat(periph,res,originesetetat);
				//console.log('-----'+periph.nom);
				callbackbe();
			});
		} else {
			callbackbe();
		}
	  },function(err){
		  GLOBAL.obj.app.serveur.emit('peripherique.update_etat_periph_of_box',box);
		  //console.log('fin chargement etat periph de box '+ box.nom);
		  callback();

	  });
}

class_peripherique.update_etat_periph=function(periph,callbackbe,originesetetat){
	periph.get_expr(function(result_json){
		
		GLOBAL.obj.app.core.set_last_etat(periph,res,originesetetat);
		//console.log('-----'+periph.nom+'=='+JSON.stringify(res));
		if (callbackbe)	callbackbe(result_json);
	});
}

//class_peripherique.prototype= new GLOBAL.req.events.EventEmitter();	
//class_peripherique.prototype.constructor=class_peripherique;


module.exports = class_peripherique;