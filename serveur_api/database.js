/**
 * New node file
 */
/*var sqlite3= require('sqlite3').verbose();*/


module.exports = function() {
	this.database=new GLOBAL.req.sqlite3.Database(__dirname+'/'+GLOBAL.req.dbmodel.name);	
	logger('INFO',{msg:'Utilisation de la base de donnée '+__dirname+'/'+GLOBAL.req.dbmodel.name},'database_sql');
	//console.log('Utilisation de la base de donnée '+__dirname+'/'+GLOBAL.req.dbmodel.name );
	this.nbsqlencours=0;
	this.nbsqltotal=0;
	this.nbsqlerror=0;
	this.transationnumber=0;
	
	this.sqlsaexecute=[];
	this.executionencours=false;
	
	
	
	
	this.controledatabase=function(){		
		logger('INFO',{msg:'Controle de la structure de la base de données.'},'database_sql');
		//console.log('Controle de la structure de la base de donn�es')
		this.controleTables(GLOBAL.req.dbmodel.tables);
	};

	this.controleTables=function(tablesmodel){
		var self=this;
		GLOBAL.obj.app.db.sqlorder("select * from sqlite_master where type='table'",
			function(tablesdb){
				for (var o = 0; o < tablesmodel.length; o++) {
					var tablemodel = tablesmodel[o];
					if (tablemodel.in_database==true) {
						var tableexist=false;
						for (var p = 0; p < tablesdb.length; p++) {
							var tabledb = tablesdb[p];
							
							if (tabledb.name==tablemodel.name){
								tableexist=true;
							}
						}
						if (tableexist){
							self.controleColonnes(tablemodel);
						} else {
							self.createTable(tablemodel);
						}
					}

					
				}
			});
	};

	this.createTable=function(tablemodel){
		var sep="";
		var sql='CREATE TABLE if not exists '+tablemodel.name+' (';
		for ( var q in tablemodel.colonnes) {
			var colonnemodel = tablemodel.colonnes[q];
			sql+=sep+colonnemodel.name+" "+colonnemodel.type;
			sep=",";
		}
		sql+=")";
		GLOBAL.obj.app.db.sqltrans(sql);

	};

	this.sqltrans=function (order,callback,dataarray){		
		logger('DEBUG',{msg:'Requete : '+order},'database_sql');
		//console.log(order);
		if (!order) {
			logger('ERROR',{order:'ordre sql null !'},'database_sql');
			callback();
		} else {
			this.sqlsaexecute.push({type:'trans',order:order,dataarray:dataarray,callback:callback});
			this.execspoolsql();
		}

		
	};
	this.sqlorder=function (order,callback,dataarray){
		logger('DEBUG',{msg:'Requete : '+order},'database_sql');
		//console.log(order);
		if (!order) {
			//console.trace('ordre null !!!',order);
			logger('ERROR',{order:'ordre sql null !'},'database_sql');
			callback();
		} else {
			this.sqlsaexecute.push({type:'order',order:order,dataarray:dataarray,callback:callback});
			this.execspoolsql();
		}

	};
	this.execspoolsql=function(){
		if (!this.executionencours && this.sqlsaexecute.length>0){
			this.executionencours=true;
			
			var self=this;
			//console.log('->database sql :'+self.sqlsaexecute.length);
			var nbsqltraite=0;
			 GLOBAL.req.async.eachSeries(self.sqlsaexecute,function(sqls,callbacke){
				 nbsqltraite++;
				 if(sqls.type=='trans'){
					 //console.log('--- exec next')
					logger('DEBUG','transac execute: '+sqls.order,'database_sql');
					 self.sqltransexec(sqls.order,function(data){
							logger('DEBUG','transac réponse: '+data,'database_sql');
							callbacke();
							if (sqls.callback) sqls.callback(data);
						},sqls.dataarray);
				 }
				 if(sqls.type=='order'){
					logger('DEBUG','order execute: '+sqls.order,'database_sql');
					 self.sqlorderexec(sqls.order,function(data){
							logger('DEBUG','order réponse: '+data,'database_sql');
							callbacke();
							if (sqls.callback){
									sqls.callback(data);
							}
						},sqls.dataarray);
				 }
				 //console.log('<-database sql :'+self.sqlsaexecute.length,sqls);
			 }
			 ,function(err){
				for (var i = 0; i < nbsqltraite; i++) {
					self.sqlsaexecute.shift();
				}
				//console.log('<-database sql :'+self.sqlsaexecute.length);
				self.executionencours=false;
				self.execspoolsql();
			 });
		}
	};
	
	this.sqltransexec=function (order,callback,dataarray){

		var selfdb=this;
		
		if (Array.isArray(order)){
			var nborder=0;
			//order.push('COMMIT;');
			selfdb.database.serialize(function() {
				selfdb.transationnumber++;
				var transtnum=selfdb.transationnumber;
				var nb=order.length;
				var transaction_encours=false;
				var transac=selfdb.database.exec("BEGIN;",function(e){
					transaction_encours=true;
					if (e) {
						//console.log(e);
				    	  logger('ERROR',{transtnum:transtnum,msg:"begin transaction probleme",err:e,order:order},'database_sql');
				      }
					//console.log('BEGIN',transtnum,e,order);
					logger('DEBUG',transtnum+" BEGIN",'database_sql');
					
				    //console.log('insertData -> begin');
				    // do multiple inserts
					GLOBAL.req.async.eachSeries(order, function (sql, callbacke) {
					// GLOBAL.req.async.map(order,function(sql, indexsql,callbacke){
					    	nborder++;
							selfdb.nbsqlencours++;
							selfdb.nbsqltotal++;
							logger('DEBUG','execute: '+sql,'database_sql');
							transac.exec(sql, function(e) {
								logger('DEBUG','  fin: '+sql,'database_sql');
								nb--;
						    	selfdb.nbsqlencours--;
								//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
								logger('INFO',transtnum+" sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
									
						        if (e) {
						        	//console.log(e);
						        	selfdb.nbsqlerror++;
									logger('ERROR',{transtnum:transtnum,msg:"erreur sql",order:sql,err:e},'database_sql');
						          // rollback here
						        } else {
						          //console.log(item);
						        }
						       
						        callbacke();
						        
						        
						      });
							
						}
				  	   ,function(err){
				  		   //console.log('COMMIT',err);
				  		   transac.exec("COMMIT;", function(e) {
						    	logger('DEBUG',transtnum+" COMMIT;",'database_sql');
							      if (nb>0) {
							    	  logger('ERROR',{transtnum:transtnum,msg:"Commit avant fin des sql",restesqls:nb,order:order},'database_sql');
							      }
							      if (e) {
							    	  logger('ERROR',{transtnum:transtnum,msg:"Commit probleme",err:e,order:order},'database_sql');
							      }
							      //console.log(e);
							      transaction_encours=false;
							      if (callback) callback(nborder);
							    });
				  	  });
				  });
			});
		} else {
			var transtnum=selfdb.transationnumber;
			selfdb.nbsqlencours++;
			selfdb.nbsqltotal++;
			selfdb.database.run("BEGIN;",function(e){
				if (e) {
			    	  logger('ERROR',{transtnum:transtnum,msg:"begin transaction probleme",err:e,order:order},'database_sql');
			      }
				var lastID=null;
				
				logger('DEBUG',{msg:'nb sql en cours: '+selfdb.nbsqlencours+', requete: '+order+', tableau: '+dataarray},'database_sql');
				//console.log(selfdb.nbsqlencours,order,dataarray);
			
				selfdb.database.run(order,dataarray,function(err) {
					selfdb.nbsqlencours--;
					//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
					logger('INFO',"sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
					if (err){
						//console.log(err);
						selfdb.nbsqlerror++;
						logger('ERROR',{msg:"erreur sql",message:err.message,order:order,err:err},'database_sql');
					}
					lastID=this.lastID;
				    selfdb.database.run("COMMIT;", function(e) {
						logger('DEBUG',transtnum+" COMMIT;",'database_sql');
				    	if (e) {
					    	  logger('ERROR',{transtnum:transtnum,msg:"Commit probleme",err:e,order:order},'database_sql');
					      }
			    		if (callback) callback(lastID);
				    });
				});		

			});
		}

	};

	this.sqlorderexec=function (order,callback,dataarray){		
		var selfdb=this;
		
		if (Array.isArray(order)){
			var nborder=0;
			selfdb.database.serialize(function() {
				
				    order.forEach(function(sql) {
				    	nborder++;
				    	
						selfdb.nbsqlencours++;
						selfdb.nbsqltotal++;
						//this.database.configure("busyTimeout", 29000);
						selfdb.database.all(sql,function(err,rows) {
							selfdb.nbsqlencours--;
							//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
							logger('INFO',"sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
							if (err){
								selfdb.nbsqlerror++;
								logger('ERROR',{msg:"erreur sql",order:order,err:err},'database_sql');
							}
							callback(rows);
						});
						
						
				    });

			});
		} else {
			selfdb.nbsqlencours++;
			selfdb.nbsqltotal++;
			//this.database.configure("busyTimeout", 29000);
			selfdb.database.serialize(function() {
				if (dataarray) {
					selfdb.database.get(order,dataarray,function(err,rows) {
						selfdb.nbsqlencours--;
						//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
						logger('INFO',"sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
						if (err){
							selfdb.nbsqlerror++;
							logger('ERROR',{msg:"erreur sql",order:order,err:err},'database_sql');
						}
						if (rows && !rows[0]) {
							callback([rows]);
						}else {
							callback(rows);
						}
						
					});						
				} else {
					selfdb.database.all(order,function(err,rows) {
						selfdb.nbsqlencours--;
						//console.log(selfdb.nbsqlencours + ' '+selfdb.nbsqltotal+ ' '+selfdb.nbsqlerror);
						logger('INFO',"sql en cours:"+selfdb.nbsqlencours+" total:"+selfdb.nbsqltotal+" error:"+selfdb.nbsqlerror,'database_sql');
						if (err){
							selfdb.nbsqlerror++;
							logger('ERROR',{msg:"erreur sql",order:order,err:err},'database_sql');
						}
						callback(rows);
					});		
				}
			
			});
		}
		/*this.database.each(order,);*/
	};
	this.controleColonnes=function(tablemodel){

		var colonnesmodel=tablemodel.colonnes;
		GLOBAL.obj.app.db.sqlorder("PRAGMA table_info("+tablemodel.name+");",
			function(colonnesdb){
				for (var o = 0; o < colonnesmodel.length; o++) {
					var colonnemodel = colonnesmodel[o];
					var colonneexist=false;
					for (var p = 0; p < colonnesdb.length; p++) {
						var colonnedb = colonnesdb[p];
						if (colonnedb.name==colonnemodel.name){
							colonneexist=true;
						}
					}
					if (!colonneexist){
						var sql ='ALTER TABLE '+tablemodel.name+' ADD COLUMN '+colonnemodel.name+' '+colonnemodel.type;
						GLOBAL.obj.app.db.sqltrans(sql);
					} 
				}
			});
		
	}
}
