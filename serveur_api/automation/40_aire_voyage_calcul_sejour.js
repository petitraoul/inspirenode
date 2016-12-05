/**
 * New node file
 */
var aire_voyage_calcul_sejour={id:40,nom:"aire_voyage_calcul_sejour",etat:"OFF",lastrun:null};
var timer=null;


aire_voyage_calcul_sejour.start=function(){
	if (aire_voyage_calcul_sejour.etat=='OFF') {
		aire_voyage_calcul_sejour.etat='ON';
		logger('INFO',{msg:'demarrage automation',nom:this.nom},'startstop');
		/*obj.app.serveur.on('core_charge_all',run_update_etat);
		obj.app.serveur.on('box.update_etat_box',actions_on_event1);
		obj.app.serveur.on('box.update_etat_boxs',actions_on_event2);
		
		/*Execution toutes les  30 secondes*/
		timer=setInterval(function(){
			calcul_sejours();
			}, 30000);
		
		
	}
}

aire_voyage_calcul_sejour.stop=function(){
	if (aire_voyage_calcul_sejour.etat=='ON') {
		aire_voyage_calcul_sejour.etat='OFF';
		logger('INFO',{msg:'extinction automation',nom:this.nom},'startstop');
		/*obj.app.serveur.removeListener('core_charge_all',actions_on_event1);
		obj.app.serveur.removeListener('box.update_etat_box',actions_on_event1);
		obj.app.serveur.removeListener('box.update_etat_boxs',actions_on_event2);*/
		clearInterval(timer);
	}

}


function calcul_sejours(){

	var sql="select r.*,nb_jour*prix_empl_jour total_empl," +
			"    nb_kwh* prix_elec_kwh total_kwh," +
			"				 nb_m3*prix_eau_m3 total_m3" +
			"	from (" +
			"" +
			"" +
			"	select t.id tag_id,s.titulaire_id,s.id sejour_id,s.date_debut," +
			"			case when s.date_fin is null and s.date_debut is not null " +
			"			       then date('now') else s.date_fin end date_fin ," +
			"			case when s.date_fin is null then julianday(date('now'))" +
			"			       else julianday(s.date_fin) end -julianday(s.date_debut) nb_jour," +
			"			p.prix_empl_jour," +
			"			" +
			"			s.valeur0,s.valeur2," +
			"			s.valeur2-s.valeur0 nb_kwh ,p.prix_elec_kwh," +
			"			" +
			"			s.valeur1,s.valeur3," +
			"			s.valeur3-s.valeur1 nb_m3,p.prix_eau_m3" +
			"			from sejour s left outer join tag t on t.nom=s.emplacement_id" +
			"			         left outer join tarif p on p.nom=s.type_tarif" +
			//"			where not exists (select 1 from compte_ecriture c where c.sejour_id=s.id)" +
			"	) r" ;
			
	GLOBAL.obj.app.db.sqlorder(sql,
			function(rows){
				if (rows) {
					var date_str=req.moment().format('YYYY-MM-DD');
					for (var l in rows){
						console.log(rows[l].titulaire_id,rows[l].sejour_id,rows[l].total_empl,rows[l].total_kwh,rows[l].total_m3);
						var sqlmaj=['delete from compte_ecriture where recu_num is null and facture_num is null and sejour_id='+rows[l].sejour_id];
						if (rows[l].total_empl){
							
							var uuid=generateUUID();
							var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe) ";
							sql+=" select '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'Frais','"+rows[l].nb_jour+"','"+rows[l].prix_empl_jour+"','"+rows[l].total_empl+"','Emplacement','"+date_str+"','-' ";
							sqlmaj.push(sql);
						}
						if (rows[l].total_kwh){
							var uuid=generateUUID();
							var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe) ";
							sql+=" select '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'Frais','"+rows[l].nb_kwh+"','"+rows[l].prix_elec_kwh+"','"+rows[l].total_kwh+"','Electricité','"+date_str+"','-' ";
							sqlmaj.push(sql);
						}
						if (rows[l].total_m3){
							var uuid=generateUUID();
							var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe) ";
							sql+=" select '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'Frais','"+rows[l].nb_m3+"','"+rows[l].prix_eau_m3+"','"+rows[l].total_m3+"','Eau','"+date_str+"','-' ";
							sqlmaj.push(sql);
						}
					}
				}
				console.log(sqlmaj);
				GLOBAL.obj.app.db.sqlorder(sqlmaj,
					function(rows){
						console.log('maj des consommation faite');
							
				});
	});
}


module.exports = aire_voyage_calcul_sejour;