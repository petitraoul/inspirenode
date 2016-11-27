/**
 * New node file
 */

var class_constante = function constante(){
	
	var self =this;
	
	this.chargeById=function(id,callback){
		
		var sql='Select * from constantes where id=\''+id+'\';';
		GLOBAL.obj.app.db.sqlorder(sql,
			function(rows){
				var data=rows[0];
				for (var p in data){
					var prop=data[p];
					self[p]=prop;
					if (prop && isNaN(prop)) {
						self[p]=""+prop;
					} else if (prop) {
						self[p]=parseFloat(prop);
					}
				}
				callback(null,self);
			});
	}

	
}

class_constante.charge_constantes=function(callback){
	  var sql='Select * from constantes c;';
	  GLOBAL.obj.app.db.sqlorder(sql,
		function(rows){
		  GLOBAL.req.async.map(rows,function(constant,callbacktt){
			  var t= new GLOBAL.req.constante();
			  t.chargeById(constant.id,callbacktt);
		  },function(err,constantes){
			  GLOBAL.obj.constantes=constantes;
			  GLOBAL.obj.app.serveur.emit('constante.charge_constantes');
			  
			  if (callback) callback();
		  })
		});
	}

class_constante.get_etat=function(id,callback){
	var sql='Select * from constantes where code=\''+id+'\';';
	GLOBAL.obj.app.db.sqlorder(sql,
		function(rows){
			if (rows && rows[0]){
				var constante_type_actuel=rows[0];
				callback(constante_type_actuel.valeur);
			} else {
				callback(null);
			}
		});

}
class_constante.set_etat=function(code,valeur,callback){
		var nom=code;
		GLOBAL.req.async.series([
		function (callbackd){
			var sql="select * from constantes where code='"+code+"';"
			GLOBAL.obj.app.db.sqlorder(sql,function(rows){
				if (rows[0] && rows[0].nom) nom=rows[0].nom;
				callbackd()
			});			
			
		},
		function (callbackd){
			var sql="delete from constantes where code='"+code+"';"
			GLOBAL.obj.app.db.sqltrans(sql,function(){
				callbackd()
			});			
		},
		function(callbacki){
			sql="insert into constantes (code,nom,valeur) values('"+code+"','"+nom+"','"+valeur+"');"
			GLOBAL.obj.app.db.sqltrans(sql,function(){
				callbacki()
			});			
		}],function(err){
			GLOBAL.req.constante.charge_constantes(callback);
			
		})
		
}
//class_categorie.prototype= new GLOBAL.req.events.EventEmitter();
module.exports = class_constante;