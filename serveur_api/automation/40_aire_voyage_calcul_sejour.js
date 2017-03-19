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


function calcul_sejours(in_titulaire_id,callback){

	
    var sql="select r.*,round(nb_jour*prix_empl_jour,2) total_empl"+
" from ("+
"	select t.id tag_id,"+
"				s.titulaire_id,"+
"				s.id sejour_id,"+
"				case when s.date_fac  "+
"					then s.date_fac "+
"					else s.date_debut "+
"				end  date_debut,"+
"				case when s.clos == 0 and s.date_debut is not null "+
"					then date('now')  "+
"					else s.date_fin   "+
"				end date_fin ,"+
"				case when s.clos == 0"+
"					then julianday(date('now'))     "+
"					else julianday(s.date_fin) "+
"				end -julianday(case when s.date_fac  "+
"					then s.date_fac "+
"					else s.date_debut "+
"				end) nb_jour,"+
"				p.prix_empl_jour, "+
"				case when s.index_fac_elec  "+
"					then s.index_fac_elec "+
"					else s.valeur0 "+
"				end  index_deb_elec,"+
"				s.clos sejour_clos,"+
"				s.valeur2 sejour_elec_fin,"+
"				p.prix_elec_kwh,"+
"				case when s.index_fac_eau  "+
"					then s.index_fac_eau "+
"					else s.valeur1 "+
"				end  index_deb_eau,"+
"				s.valeur3 sejour_eau_fin,"+
"				p.prix_eau_m3, "+
"				t.periph_eau_id, "+
"				t.periph_elec_id "+
" "+
" from sejour s "+
"		left outer join tag t on t.id=s.emplacement_id       "+
"		left outer join tarif p on p.id=s.type_tarif"+
"		) r";
if (in_titulaire_id){
		sql+= " where r.titulaire_id="+in_titulaire_id;
	}
	sql+= ";";
            logger('DEBUG',{msg:'Requete : '+sql,nom:this.nom},'40_calcul_sejour');
            
    GLOBAL.obj.app.db.sqlorder(sql,
            function(rows){
                if (rows) {
                    var date_str=req.moment().format('YYYY-MM-DD');     
					var sqlmaj=[];		
                    logger('DEBUG',{msg:'Date : '+date_str,nom:this.nom},'40_calcul_sejour');
                    for (var l in rows){
                        logger('DEBUG',{msg:'Titulaire : '+rows[l].titulaire_id,nom:this.nom},'40_calcul_sejour');
                        logger('DEBUG',{msg:'Séjour : '+rows[l].sejour_id,nom:this.nom},'40_calcul_sejour');
                        logger('DEBUG',{msg:'cout emplacement : '+rows[l].total_empl+' date début: '+rows[l].date_debut+' date fin: '+rows[l].date_fin+' nombre de jour: '+rows[l].nb_jour,nom:this.nom},'40_calcul_sejour');
						
                        if (rows[l].total_empl){
							sqlmaj.push("delete from compte_ecriture where recu_num is null and facture_num is null and type_operation = 9 and libelle = 'Emplacement' and sejour_id="+rows[l].sejour_id+";");
                            
                            var uuid=generateUUID();
                            var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe,calcul_solde, index_deb, index_fin) ";
                            sql+=" values( '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'9','"+rows[l].nb_jour+"','"+rows[l].prix_empl_jour+"','"+rows[l].total_empl+"','Emplacement','"+date_str+"','-' "+",'O' "+",'"+rows[l].date_debut+"','"+rows[l].date_fin+"')"+";";
                            logger('DEBUG',{msg:'Requete : '+sql,nom:this.nom},'40_calcul_sejour');
							sqlmaj.push(sql);
                        }
						
						//calcul élec
						var total_kwh=0;
						var nb_kwh=0;
						var index_elec_fin=0;
						var periph_elec=obj.app.core.findobj(rows[l].periph_elec_id,'peripheriques');
                        logger('DEBUG',{msg:'sejour clos : '+rows[l].sejour_clos,nom:this.nom},'40_calcul_sejour');
						if (rows[l].sejour_clos==1){
							logger('DEBUG',{msg:'index fin elec sejour : '+rows[l].sejour_elec_fin,nom:this.nom},'40_calcul_sejour');
							index_elec_fin=rows[l].sejour_elec_fin;
						}else{
							logger('DEBUG',{msg:'index fin elec memoire : '+periph_elec.last_etat.expression.etat,nom:this.nom},'40_calcul_sejour');
							index_elec_fin=periph_elec.last_etat.expression.etat;
						}
						logger('DEBUG',{msg:'index_deb_elec : '+rows[l].index_deb_elec,nom:this.nom},'40_calcul_sejour');
						nb_kwh=index_elec_fin-rows[l].index_deb_elec;
						logger('DEBUG',{msg:'nb_kwh : '+nb_kwh,nom:this.nom},'40_calcul_sejour');
						total_kwh=rows[l].prix_elec_kwh*nb_kwh;
						logger('DEBUG',{msg:'total_kwh : '+total_kwh,nom:this.nom},'40_calcul_sejour');
						
                        if (total_kwh){
							sqlmaj.push("delete from compte_ecriture where recu_num is null and facture_num is null and type_operation = 9 and libelle = 'Electricité' and sejour_id="+rows[l].sejour_id+";");
                            var uuid=generateUUID();
                            var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe,calcul_solde, index_deb, index_fin) ";
                            sql+=" values( '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'9','"+nb_kwh+"','"+rows[l].prix_elec_kwh+"','"+total_kwh+"','Electricité','"+date_str+"','-' "+",'O' "+",'"+rows[l].index_deb_elec+"','"+index_elec_fin+"')"+";";
                            logger('DEBUG',{msg:'Requete : '+sql,nom:this.nom},'40_calcul_sejour');
							sqlmaj.push(sql);
                        }
						
						
						//calcul eau
						var total_m3=0;
						var nb_m3=0;
						var index_eau_fin=0;
						var periph_eau=obj.app.core.findobj(rows[l].periph_eau_id,'peripheriques');
                        logger('DEBUG',{msg:'sejour clos : '+rows[l].sejour_clos,nom:this.nom},'40_calcul_sejour');
						if (rows[l].sejour_clos==1){
							logger('DEBUG',{msg:'index fin eau sejour : '+rows[l].sejour_eau_fin,nom:this.nom},'40_calcul_sejour');
							index_eau_fin=rows[l].sejour_eau_fin;
						}else{
							logger('DEBUG',{msg:'index fin eau memoire : '+periph_eau.last_etat.expression.etat,nom:this.nom},'40_calcul_sejour');
							index_eau_fin=periph_eau.last_etat.expression.etat;
						}
						logger('DEBUG',{msg:'index_deb_eau : '+rows[l].index_deb_eau,nom:this.nom},'40_calcul_sejour');
						nb_m3=index_eau_fin- rows[l].index_deb_eau;
						logger('DEBUG',{msg:'nb_m3 : '+nb_m3,nom:this.nom},'40_calcul_sejour');
						total_m3=rows[l].prix_eau_m3*nb_m3;
						logger('DEBUG',{msg:'total_m3 : '+total_m3,nom:this.nom},'40_calcul_sejour');
						
                        if (total_m3){
							sqlmaj.push("delete from compte_ecriture where recu_num is null and facture_num is null and type_operation = 9 and libelle = 'Eau' and sejour_id="+rows[l].sejour_id+";");
                            var uuid=generateUUID();
                            var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe,calcul_solde, index_deb, index_fin) ";
                            sql+=" values( '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'9','"+nb_m3+"','"+rows[l].prix_eau_m3+"','"+total_m3+"','Eau','"+date_str+"','-' "+",'O' "+",'"+rows[l].index_deb_eau+"','"+index_eau_fin+"')"+";";
                            logger('DEBUG',{msg:'Requete : '+sql,nom:this.nom},'40_calcul_sejour');
							sqlmaj.push(sql);
                        }
                    }
                }
                //console.log(sqlmaj);
                GLOBAL.obj.app.db.sqltrans(sqlmaj,
                    function(rows){
                        logger('DEBUG',{msg:'Mise à jour des consos : '+rows,nom:this.nom},'40_calcul_sejour');
						if(callback){
							callback();
						}
                            
                });
    });
}


module.exports = aire_voyage_calcul_sejour;