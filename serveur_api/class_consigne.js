/**
 * New node file
 */

var class_consigne = function consigne(){
	
	var self =this;
	
	this.chargeById=function(id,callback){
		GLOBAL.req.async.series([
  		   /*chargement des data*/
  		      function(callbackd){ 
  				var sql='Select * from consigne_temp where id=\''+id+'\';';
  				//var sql='Select * from consigne_temp_jours c where id=\''+id+'\';';
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
  			/*chargement tags*/
  		      function(callbackt){    
  		    	 var sql='Select * from consigne_temp_jours c where id_consigne_temp=\''+id+'\';';  			    	  
		    	 self.jours=JSON.parse(JSON.stringify(GLOBAL.obj.app.core.findobj('jours','tables').object)) ;
  		    	 
	   			  for (var j in self.jours) {
					self.jours[j].value=false;
				  }
		    	 GLOBAL.obj.app.db.sqlorder(sql,
					function(rows){
		    		  GLOBAL.req.async.map(rows,function(jour,callbacktt){
		    			  for (var j in self.jours) {
		    				  if (self.jours[j].id==jour.id_jours){
		    					  self.jours[j].value=true;
		    				  } 
		    			  }
					      callbacktt(null,jour);
		    		  },function(err,jours){
		    			  //self.tag=tags;
		    			  callbackt();
		    		  })
					});
		      },
  		      
          ], function(err) { //This is the final callback
 
              callback(null,self);
          });
	}

}

class_consigne.charge_consignes=function(callback){
  	  var sql='Select * from consigne_temp c;';
  	  
	  GLOBAL.obj.app.db.sqlorder(sql,
		function(rows){
		  GLOBAL.req.async.map(rows,function(consigne,callbacktt){
			  var t= new GLOBAL.req.consigne();
			  t.chargeById(consigne.id,callbacktt);
		  },function(err,consignes){
			  
			  GLOBAL.obj.consignes=consignes;
			  GLOBAL.obj.app.serveur.emit('consigne.charge_consignes');
			  callback();
		  })
		});
	}

module.exports = class_consigne;