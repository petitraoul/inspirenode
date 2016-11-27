/**
 * New node file
 */


var class_tag = function tag(){
	var self =this;
	
	this.chargeById=function(id,callback){
		var sql='Select * from tag where id=\''+id+'\';';

		GLOBAL.obj.app.db.sqlorder(sql,
			function(rows){
				var data =rows[0];
				for (var p in data){
					var prop=data[p];
					self[p]=prop;
				}
				
				callback(null,self);
				
			});
	}
	
	
	this.charge_parents=function(callback){
		if (self.parent_tag) {
			self.parent=GLOBAL.obj.app.core.findobj(self.parent_tag,'tags');
		}
		/*self.enfants=[];
		for (t in GLOBAL.obj.tags){
			if (GLOBAL.obj.tags[t].parent_tag==self.id){
				self.enfants.push(GLOBAL.obj.tags[t]);
			}
		}*/
		
		callback();
	}
	
	this.get_child=function(){
		var enfants=[];
		for (var t in GLOBAL.obj.tags){
			if (GLOBAL.obj.tags[t].parent_tag==self.id){
				enfants.push(GLOBAL.obj.tags[t]);
			}
		}
		return enfants;
	}
	
	this.findchild_visible=function(array_res){
		if (this.visible=='N') {
			var child_of_this=this.get_child();
			for (var c in child_of_this){
				child_of_this[c].findchild_visible(array_res);
			}			
		} else {
			array_res.push(this);
		}
		return array_res;
	}
}

class_tag.charge_tags = function(callback){
  	  var sql='Select * from tag t;';
	  GLOBAL.obj.app.db.sqlorder(sql,
		function(rows){
		  GLOBAL.req.async.map(rows,function(tag,callbacktt){
			  var t= new GLOBAL.req.tag();
			  t.chargeById(tag.id,callbacktt);
		  },function(err,tags){
			  GLOBAL.obj.tags=tags;
			  GLOBAL.obj.app.serveur.emit('tag.charge_tags');
			  callback();
		  })
		});
	}
class_tag.charge_parents_tags=function(callback){
	 GLOBAL.req.async.map(GLOBAL.obj.tags,function(tag,callbacktt){
		  tag.charge_parents(callbacktt);
	  },function(err,tags){
		  GLOBAL.obj.app.serveur.emit('tag.charge_parents_tags');
		  callback();
	  })
	}
//class_tag.prototype= new GLOBAL.req.events.EventEmitter();
module.exports = class_tag;