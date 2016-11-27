/**
 * New node file
 */



var mailsender = function(to,texte,from,objet) {
	var servicehttp='/adr/comm_with_mail.php?'
	this.to=to;
	this.texte=texte;
	this.from=from;
	this.objet=objet;
	this.sendmailbyhttp =function (callback){
		var url=servicehttp+'to='+this.to;
		url+= '&texte='+this.texte;
		url+= '&from='+this.from;
		url+= '&objet='+this.objet;
		GLOBAL.req.comm.perso_get('www.inspirelec.com',url,80,function(err,httpResponse,body){
			console.log(body);
			callback(err,body);
		});
	}
}

module.exports = mailsender;