/**
 * New node file
 */


var parserxml2json = new GLOBAL.req.xml2js.Parser();

module.exports =function(variables,res,user){
    	
		switch (variables.action) {
		case 'testconnection':
			if (user.type =='ADMINISTRATEUR' || user.type=='ADMIN' || !user.type) {
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			} else {
				res.writeHead(404, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end();
			}

			break;
		case 'listservicemsg':
			var rep = [];
			var line1={id:1,nom:"Service de sms",destinataire:this.user.phone,objet:"Test sms",message:"Test sms ;-)",from:GLOBAL.obj.app.core.findobj('idapplication','constantes').valeur,type_envoi:'smshttp'};
			var line2={id:2,nom:"Service de mail",destinataire:this.user.mail,objet:"Test mail",message:"Test mail ;-)",from:GLOBAL.obj.app.core.findobj('idapplication','constantes').valeur + '@inspirelec.com',type_envoi:'mailhttp'};
			rep.push(line1);
			rep.push(line2);
			rep=JSON.stringify(rep);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'detailservicemsg':
			var rep = [];
			var line1={id:1,nom:"Service de sms",destinataire:this.user.phone,objet:"Test sms",message:"Test sms ;-)",from:GLOBAL.obj.app.core.findobj('idapplication','constantes').valeur,type_envoi:'smshttp'};
			var line2={id:2,nom:"Service de mail",destinataire:this.user.mail,objet:"Test mail",message:"Test mail ;-)",from:GLOBAL.obj.app.core.findobj('idapplication','constantes').valeur,type_envoi:'mailhttp'};
			if (variables.id==1) rep.push(line1);
			if (variables.id==2) rep.push(line2);

			rep=JSON.stringify(rep);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'listautomation':
			var rep = [];
			
			for (a in GLOBAL.automation) {
				
				try {
					var t=JSON.stringify(GLOBAL.automation[a]);
					rep.push(GLOBAL.automation[a]);
				} catch (e) {
					console.log(GLOBAL.automation[a].nom);
					console.log(e);
					console.log(new Error().stack);
				}
				
			}
			rep=JSON.stringify(rep);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'detailautomation':
			
			var repo = GLOBAL.obj.app.core.findobj(variables.id,'automation');
			var rep=[];
			rep.push(repo);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.end(JSON.stringify(rep));
			break;
		case 'getaccueilmenu' :
			if (user.type =='ADMINISTRATEUR' || user.type=='ADMIN' || !user.type) {

				var rep = GLOBAL.req.dbmodel.menus;

				var rep = JSON.stringify(rep);
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
			} else {
				res.writeHead(404, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end();
			}
			break;
		case 'listboxdistante':
			
			var rep=[] ;
			for (var b in GLOBAL.obj.boxs) {
				if (GLOBAL.obj.boxs[b].model !='inspirenode_box' &&
						GLOBAL.obj.boxs[b].model !='inspirenode_periph') {
					var box=JSONfusion({},GLOBAL.obj.boxs[b]);
					delete (box.password_auth);
					delete (box.user_auth);
					rep.push(box);
				}
			}
			rep=JSON.stringify(rep);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;

		case 'listbox':
			var sql='Select * from box order by id;';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;	
		case 'listhighchart':
			console.log('passe ici');
			var graphiques=GLOBAL.graphique;
			var rep = JSON.stringify(graphiques);
			console.log(rep);
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;		
		case 'detailhighchart':
			var graphconfig={};
			for (g in GLOBAL.graphique){
				if (GLOBAL.graphique[g].uuid==variables.uuid){
					graphconfig=GLOBAL.graphique[g];
					graphconfig.getdataderver(res,variables);
					
					break;
				}
			}
			
			break;
		case 'listconsigne_temp':
			var sql='Select * from consigne_temp order by mode,tag;';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'detailconsigne_temp':
			var sql='Select * from consigne_temp where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listconsigne_temp_jours':
			var sql='Select * from consigne_temp_jours';
			if (variables.id) sql+= " where id_consigne_temp='"+variables.id+"'";
			sql+=';'
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
				GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listjours':
			var jours=GLOBAL.obj.app.core.findobj('jours','tables').object;
			var rep = JSON.stringify(jours);
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;	
		case 'detailbox':
			var sql='Select * from box where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listcategorie':
			var sql='Select * from categorie order by id;';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'detailcategorie':
			var sql='Select * from categorie where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listtype':
			var sql='Select * from type order by id;';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'detailtype':
			var sql='Select * from type where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listmode':
			var sql='Select * from mode order by id;';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'detailmode':
			var sql='Select * from mode where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listtag':
			var sql='Select * from tag order by id';
			sql+=';'
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
				GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listtag_voyage':
			var sql=" Select t.* ,pc.uuid periph_elec_uuid,pe.uuid periph_eau_uuid" +
					" from tag t left outer join peripherique pc on pc.id=t.periph_elec_id" +
					"			  left outer join peripherique pe on pe.id=t.periph_eau_id" +
					" order by id";
			sql+=';'
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
				GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'detailtag':
			var sql='Select * from tag where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listperipherique_tag':
			var sql='Select * from peripherique_tag';
			if (variables.id) sql+= " where id_peripherique='"+variables.id+"'";
			sql+=';'
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
				GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listperipherique_user_acceuil':
			var sql='Select * from peripherique_user_acceuil';
			if (variables.id) sql+= " where id_peripherique='"+variables.id+"'";
			sql+=';'
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
				GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listperipherique':
			/*var sql='Select * from peripherique order by nom;';
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){*/

					var rep = JSON.stringify(GLOBAL.obj.peripheriques);
					
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				/*});*/
			break;
		case 'listperipheriquedeporte':
			/*var sql='Select * from peripherique order by nom;';
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){*/

				var rep = JSON.stringify(GLOBAL.obj.peripheriquesdeportes);
				
				res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
				res.end(rep);
				/*});*/
			break;
		case 'listperipheriquedistant':
			
			var rep=[] ;
			for (var p in GLOBAL.obj.peripheriques) {
				if (GLOBAL.obj.peripheriques[p].box && GLOBAL.obj.peripheriques[p].box.model!='inspirenode_box' &&
						GLOBAL.obj.peripheriques[p].box.model !='inspirenode_periph') {
					var periph=JSONfusion({},GLOBAL.obj.peripheriques[p]);
						if (periph.box) {
							if (periph.box.last_etat) delete(periph.box.last_etat);
							delete(periph.box.password_auth);
							delete(periph.box.user_auth);
						}
						if (periph.tag){
							for (var t_id = 0; t_id < periph.tag.length; t_id++) {
								delete(periph.tag[t_id].parent);
							}
						}
					rep.push(periph);
				}
			}			

			rep=JSON.stringify(rep);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'detailperipherique':
			var sql='Select * from peripherique where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listperipheriquealarme':
			/*var sql='Select * from peripherique order by nom;';
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){*/
					var rep = JSON.stringify(GLOBAL.obj.peripheriques_alarme);
					
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				/*});*/
			break;		
		case 'listperipheriquealarme_tag':
			
			
			var objs=[];
			var p=GLOBAL.obj.app.core.findobj(variables.id,'peripheriques_alarme')
			for (t in p.tag) {
				var tl={};
				tl.id_tag= p.tag[t].id;
				tl.id_peripheriquealarme=p.id;
				objs.push(tl);
			}
			var rep = JSON.stringify(objs);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep)
			break;
		case 'detailperipheriquealarme':

			var objs=[];
			
			objs.push(GLOBAL.obj.app.core.findobj(variables.id,'peripheriques_alarme'));
			var rep = JSON.stringify(objs);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep)
			break;
		case 'listperipheriquechauffdistant':
			var rep=[];
			for (var p in GLOBAL.obj.peripheriques_chauffage) {
				if (GLOBAL.obj.peripheriques_chauffage[p].box && GLOBAL.obj.peripheriques_chauffage[p].box.model!='inspirenode_box' &&
						GLOBAL.obj.peripheriques_chauffage[p].box.model !='inspirenode_periph') {
					var periph=JSONfusion({},GLOBAL.obj.peripheriques_chauffage[p]);
						if (periph.box) {
							if (periph.box.last_etat) delete(periph.box.last_etat);
							delete(periph.box.password_auth);
							delete(periph.box.user_auth);
						}
						if (periph.tag){
							for (var t_id = 0; t_id < periph.tag.length; t_id++) {
								delete(periph.tag[t_id].parent);
							}
						}
						delete(periph.sondes_autres);
						delete(periph.sondes_temp);
						delete(periph.chaudiere);
						delete(periph.chauffage);
					rep.push(periph);
				}
			}
			var rep = JSON.stringify(rep);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
				/*});*/
			break;	
		case 'listperipheriquechauff':

			var rep = JSON.stringify(GLOBAL.obj.peripheriques_chauffage);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			
			break;		
		case 'listperipheriquechauff_tag':
			
			
			var objs=[];
			for (t in GLOBAL.obj.peripheriques_chauffage[variables.id].tag) {
				var tl={};
				tl.id_tag= GLOBAL.obj.peripheriques_chauffage[variables.id].tag[t].id;
				tl.id_peripheriquechauff=GLOBAL.obj.peripheriques_chauffage[variables.id].id;
				objs.push(tl);
			}
			var rep = JSON.stringify(objs);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep)
			break;
		case 'detailperipheriquechauff':

			var objs=[];
			objs.push(GLOBAL.obj.peripheriques_chauffage[variables.id]);
			var rep = JSON.stringify(objs);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep)
			break;
		case 'listperipheriquebatterie':

			var rep = JSON.stringify(GLOBAL.obj.peripheriques_batterie);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
				
			break;		
		case 'listperipheriquebatterie_tag':
			
			
			var objs=[];
			var p=GLOBAL.obj.app.core.findobj(variables.id,'peripheriques_batterie')
			for (t in p.tag) {
				var tl={};
				tl.id_tag= p.tag[t].id;
				tl.id_peripheriquebatterie=p.id;
				objs.push(tl);
			}
			var rep = JSON.stringify(objs);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep)
			break;
		case 'detailperipheriquebatterie':

			var objs=[];
			
			objs.push(GLOBAL.obj.app.core.findobj(variables.id,'peripheriques_batterie'));
			var rep = JSON.stringify(objs);
			
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep)
			break;

		case 'listconstantes':
			var sql='Select * from constantes order by id;';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;		
		case 'detailconstantes':
			var sql='Select * from constantes where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listbox_virtuel_etat':
			var sql='Select * from box_virtuel_etat;';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;		
		case 'detailbox_virtuel_etat':
			var sql='Select * from box_virtuel_etat where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listutilisateurs':
			var sql='Select u.user nom,u.* from utilisateurs u;';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;

		case 'detailutilisateurs':
			var sql='Select * from utilisateurs where id=\''+variables.id+'\';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'listpubs':
			var pubs=GLOBAL.req.fs.readdirSync(__dirname+'/../pubs/');
			var respubs ={};
			respubs.files=[];
			respubs.racine='http://www.inspirelec.com/'
			for (var i = 0; i < pubs.length; i++) {
				var pub = pubs[i];
				var stats = GLOBAL.req.fs.statSync(__dirname+'/../pubs/'+pub)
				
				var fileSizeInBytes = stats["size"]
				var respub={"id":"pubs/"+pub, "nom":pub,"location":"pubs/"+pub, "size":fileSizeInBytes};
				respubs.files.push(respub);
			}
			var rep = JSON.stringify(respubs);
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);
			break;
		case 'listimages':
			var images=GLOBAL.req.fs.readdirSync(__dirname+'/../images/');
			var resimages =[];
			for (var i = 0; i < images.length; i++) {
				var image = images[i];
				var resimage={"id":"images/"+image, "nom":"images/"+image};
				resimages.push(resimage);
			}
			var rep = JSON.stringify(resimages);
			res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
			res.end(rep);

			break;
		case 'listmodelbox':
			var sql='Select * from modelbox;';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;



		case 'listlog':
			var sql='Select * from utilisateurs;';
			logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;
		case 'boxetat':
			var box=new GLOBAL.req.box();
			box.chargeByData(variables.data,function(err,boxobj){
				boxobj.get_etatbox(function(result_json){
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.write(JSON.stringify(result_json));
					res.end("");				
				});
				
			})
			break;
		case 'periphboxetat':
			var box=new GLOBAL.req.box();
			var periphdata=variables.data;
			box.chargeById(periphdata.box_id,function(err,boxobj){
				box.get_etatbox(function(result_json){
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.write(JSON.stringify(result_json));
					res.end("");				
				});
				
			})
			break;		
		case 'periphetat':
			var periphobj=GLOBAL.obj.app.core.findinperiphs(variables.data.uuid);
			periphobj.get_etat(function(p,result_json){
				res.writeHead(200, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.write(JSON.stringify(result_json));
				res.end("");				
			});	
					
			break;		
		case 'periphexpress':
			var periphobj=GLOBAL.obj.app.core.findinperiphs(variables.data.uuid);
			var periphdata=variables.data;
				periphobj.get_expr(function(result_json){
					res.writeHead(200, 
							{'Content-Type': 'text/plain',
							 'Access-Control-Allow-Origin': '*'});
					res.write(JSON.stringify(result_json));
					res.end("");				
				});
					
			break;
		case 'afficheobject':
			var obj=GLOBAL.obj.app.core.findobj(variables.data.id,variables.typeobj);
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					 'Access-Control-Allow-Origin': '*'});
			res.write(JSON.stringify(obj));
			res.end("");	
			break;
		case 'allconfig':
			res.writeHead(200, 
					{'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': '*'});		
			res.end(JSON.stringify(GLOBAL.obj.peripheriques));
			
			break;
		case 'listtagfamille':
			var sql="select t.uuid tag_uuid,t.nom tag_nom, s.titulaire_id" +
					" from sejour s ,tag t" +
					" where s.date_debut<=date('now')" +
					" and (s.date_fin isnull or s.date_fin>=date('now'))" +
					" and t.id=s.emplacement_id" +
					" and t.uuid='"+variables['uuid']+"'";
					
			logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
			GLOBAL.obj.app.db.sqlorder(sql,
				function(rows){
					var rep = JSON.stringify(rows);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				});
			break;


		default:
			var complsql="";
			if(variables.id && variables.id.substr(0,1)!="=" && 
					variables.id && variables.id.substr(0,1)!=" " && 
					variables.id && variables.id.substr(0,1)!="!" && 
					variables.id && variables.id.substr(0,1)!="l" && 
					variables.id && variables.id.substr(0,1)!="L" && 
					variables.id && variables.id.substr(0,1)!=">" &&
					variables.id && variables.id.substr(0,1)!="<"   ){
				variables.id='='+variables.id;
			}
			for (d in variables){
				if (d!='etat' && d!='action' && d!='type'  && d!='query'  && d!='queryfields'  && d!='limit' && variables[d]){
					complsql+= " and "+d+" "+variables[d];
				} 
			}
			
			if (variables['query'] && variables['queryfields']){
				var complsqlq=" 1=0 "
				var fields=variables['queryfields'].split(';');
				for (var f in fields){
					complsqlq+= " or "+fields[f]+" like '%"+variables['query']+"%'";
				}
				complsql+=" and ("+complsqlq+")";
			} 
			var complsqllimit=" ";
			if (variables['limit']){
				complsqllimit=" limit "+variables['limit'];
			}
			if (variables['etat'] ){
				switch (variables['etat']) {
					case 'actif' :
						complsql+=' and ( exists (select * from sejour s where s.titulaire_id=personne.id and (clos =0 or clos is null))) ';
					break;
					case 'clos' :
						complsql+=' and ( not exists  (select * from sejour s where s.titulaire_id=personne.id and (clos =0 or clos is null))) ';
					break;
				}
			}
			
			if (variables.action.substr(0,4)=='list'){
				var sql='Select * from '+variables.action.substr(4,100)+ ' where 1=1 '+complsql+' order by 1 desc '+complsqllimit+';';
				//console.log(sql);
				var tabledb=GLOBAL.obj.app.core.findobj(variables.action.substr(4,100),'tables');
				if (tabledb && tabledb.object){
					var rep = JSON.stringify(tabledb.object);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(rep);
				} else {
					//console.log('get',sql);					
					logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
					GLOBAL.obj.app.db.sqlorder(sql,
					function(rows){
						var rep = JSON.stringify(rows);
						res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
						res.end(rep);
					});
				}
				
				

				
			} else if (variables.action.substr(0,6)=='detail'){
				var sql='Select * from '+variables.action.substr(6,100)+' where 1=1 '+complsql+';';
				logger('DEBUG',{nom:'requete get :',sql:sql},'Requete_action_get');
				GLOBAL.obj.app.db.sqlorder(sql,
					function(rows){
						var rep = JSON.stringify(rows);
						res.writeHead(200, 
									{'Content-Type': 'text/plain',
									 'Access-Control-Allow-Origin': '*'});
						res.end(rep);
					});
				break;
				
			} else {
				res.writeHead(404, 
						{'Content-Type': 'text/plain',
						 'Access-Control-Allow-Origin': '*'});
				res.end("");
			}

			break;
	}
};
