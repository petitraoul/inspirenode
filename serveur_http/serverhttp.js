/*var http = require('http');
var events = require('events');
var request_action= require('./request_action.js');
var dispatcher = require('./httpdispatcher.js');*/



var Server = function serverhttp(adresseip,port,app) {
	var self=this;
	this.adresseip=adresseip;
	this.port=port;
	this.dispatcher=GLOBAL.req.httpdispatcher;
	this.requestclient= new GLOBAL.req.events.EventEmitter();
	this.emit=function(){
		var log='Event serveur http emit event : '+arguments[0];
		var info="";
		if (arguments[1] && arguments[1].id) {
			info+= " id="+arguments[1].id;
		} 
		if (arguments[1] && arguments[1].nom) {
			info+= " nom="+arguments[1].nom;
		}
		if (info=="" && arguments[0]) {
			info=JSON.stringify(arguments)
		}
		//console.log(log + "   ("+info+" )");
		Server.prototype.emit.apply(this,arguments);
	}
	this.start=function(){
		this.httpserver.listen(this.port,this.adresseip);
		
		this.emit('serveur_http.start',this.port,this.adresseip);
	};
	this.receivereq=function (req,res){
		self.dispatcher(req,res);
	};
	
	this.httpserver=GLOBAL.req.http.createServer(this.receivereq);
};

Server.prototype= new GLOBAL.req.events.EventEmitter();
module.exports = Server;