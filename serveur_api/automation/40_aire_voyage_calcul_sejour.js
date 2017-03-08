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

    var sql="select r.*,round(nb_jour*prix_empl_jour,2) total_empl,    round(nb_kwh* prix_elec_kwh,2) total_kwh,"+
"round(nb_m3*prix_eau_m3,2) total_m3 "+
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
"				case when s.clos == 0"+
"					then hi.elec "+
"					else s.valeur2"+
"				end  index_fin_elec,		"+
"				case when s.clos == 0"+
"					then hi.elec "+
"					else s.valeur2"+
"				end - case when s.index_fac_elec  "+
"					then s.index_fac_elec "+
"					else s.valeur0 "+
"				end nb_kwh ,"+
"				p.prix_elec_kwh,"+
"				case when s.index_fac_eau  "+
"					then s.index_fac_eau "+
"					else s.valeur1 "+
"				end  index_deb_eau,"+
"				case when s.clos == 0"+
"					then eau.compt "+
"					else s.valeur3"+
"				end  index_fin_eau,	"+
"				case when s.clos == 0"+
"					then eau.compt "+
"					else s.valeur3"+
"				end-case when s.index_fac_eau  "+
"					then s.index_fac_eau "+
"					else s.valeur1 "+
"				end nb_m3,"+
"				p.prix_eau_m3 "+
" "+
" from sejour s "+
"		left outer join tag t on t.id=s.emplacement_id       "+
"		left outer join tarif p on p.id=s.type_tarif"+
"		left outer join (select max(h.etat) elec, max(h.timestamp) dat, s.id sejour_id"+
"								from historique h, sejour s, tag t, peripherique p"+
"								where s.emplacement_id = t.id"+
"										   and h.uuid = p.uuid"+
"										   and p.id = t.periph_elec_id"+
"								GROUP by s.id  ) hi"+
"								on date(hi.dat) =	case when s.clos == 0 and s.date_debut is not null "+
"																then date('now')  "+
"																else s.date_fin   "+
"															end"+
"									 and hi.sejour_id = s.id"+
"			left outer join (select max(h.etat) compt, max(h.timestamp) dat, s.id sejour_id"+
"								from historique h, sejour s, tag t, peripherique p"+
"								where s.emplacement_id = t.id"+
"										   and h.uuid = p.uuid"+
"										   and p.id = t.periph_eau_id"+
"								GROUP by s.id  ) eau"+
"								on date(eau.dat) =	case when s.clos == 0 and s.date_debut is not null "+
"																then date('now')  "+
"																else s.date_fin   "+
"															end"+
"									 and eau.sejour_id = s.id) r";
            
            logger('DEBUG',{msg:'Requete : '+sql,nom:this.nom},'40_calcul_sejour');
            
    GLOBAL.obj.app.db.sqlorder(sql,
            function(rows){
                if (rows) {
                    var date_str=req.moment().format('YYYY-MM-DD');                 
                    logger('DEBUG',{msg:'Date : '+date_str,nom:this.nom},'40_calcul_sejour');
                    for (var l in rows){
                        logger('DEBUG',{msg:'Titulaire : '+rows[l].titulaire_id,nom:this.nom},'40_calcul_sejour');
                        logger('DEBUG',{msg:'Séjour : '+rows[l].sejour_id,nom:this.nom},'40_calcul_sejour');
                        logger('DEBUG',{msg:'cout emplacement : '+rows[l].total_empl,nom:this.nom},'40_calcul_sejour');
                        logger('DEBUG',{msg:'nb kwh : '+rows[l].total_kwh,nom:this.nom},'40_calcul_sejour');
                        logger('DEBUG',{msg:'nb m3 : '+rows[l].total_m3,nom:this.nom},'40_calcul_sejour');
                        console.log(rows[l].titulaire_id,rows[l].sejour_id,rows[l].total_empl,rows[l].total_kwh,rows[l].total_m3);
                        var sqlmaj=['delete from compte_ecriture where recu_num is null and facture_num is null and sejour_id='+rows[l].sejour_id];
                        if (rows[l].total_empl){
                            
                            var uuid=generateUUID();
                            var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe,calcul_solde, index_deb, index_fin) ";
                            sql+=" select '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'9','"+rows[l].nb_jour+"','"+rows[l].prix_empl_jour+"','"+rows[l].total_empl+"','Emplacement','"+date_str+"','-' "+",'O' "+",'"+rows[l].date_debut+"','"+rows[l].date_fin+"'";
                            sqlmaj.push(sql);
                        }
                        if (rows[l].total_kwh){
                            var uuid=generateUUID();
                            var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe,calcul_solde, index_deb, index_fin) ";
                            sql+=" select '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'9','"+rows[l].nb_kwh+"','"+rows[l].prix_elec_kwh+"','"+rows[l].total_kwh+"','Electricité','"+date_str+"','-' "+",'O' "+",'"+rows[l].index_deb_elec+"','"+rows[l].index_fin_elec+"'";
                            sqlmaj.push(sql);
                        }
                        if (rows[l].total_m3){
                            var uuid=generateUUID();
                            var sql="insert into compte_ecriture  (uuid,sejour_id,titulaire_id,type_operation,qte,pu,montant,libelle,date,signe,calcul_solde, index_deb, index_fin) ";
                            sql+=" select '"+uuid+"',"+rows[l].sejour_id+","+rows[l].titulaire_id+",'9','"+rows[l].nb_m3+"','"+rows[l].prix_eau_m3+"','"+rows[l].total_m3+"','Eau','"+date_str+"','-' "+",'O' "+",'"+rows[l].index_deb_eau+"','"+rows[l].index_fin_eau+"'";
                            sqlmaj.push(sql);
                        }
                    }
                }
                //console.log(sqlmaj);
                GLOBAL.obj.app.db.sqltrans(sqlmaj,
                    function(rows){
                        console.log('maj des consommation faite');
                            
                });
    });
}


module.exports = aire_voyage_calcul_sejour;