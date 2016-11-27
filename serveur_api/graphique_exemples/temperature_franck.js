/**
 * New node file
 */

module.exports=

        {
        title: {
            text: 'Temperature instantanée',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: 31 rue du tourniquet',
            x: -20
        },
		chart: {
            zoomType: 'x'
        },
        xAxis: {
            type: 'datetime',            
			startOnTick: false,
			minRange: 1 * 3600000 
        },
        yAxis: {
            title: {
                text: 'Température en C°'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            	name: 'Piece de vie',
            	datacode:'tag_35'
            },{
                name: 'Exterieur',
                datacode:'tag_34'
            },{
                name: 'Salle de jeu',
                datacode:'tag_26'
            },{
                name: 'Salle d eau',
                datacode:'tag_38'
            },{
                name: 'Salle de bain',
                datacode:'tag_31'
            },{
                name: 'Chambre Parents',
                datacode:'tag_2'
            },{
                name: 'Chambre Nathan',
                datacode:'tag_3'
            },{
                name: 'Chambre Maxime',
                datacode:'tag_17'
            },{
                name: 'Chambre garage',
                datacode:'tag_37'
            },
            
            
            {
            	name: 'Consigne Piece de vie',
            	code:'tag_35_consigne'
            },{
                name: 'Consigne Salle de jeu',
                code:'tag_26_consigne'
            },{
                name: 'Consigne Salle d eau',
                code:'tag_38_consigne'
            },{
                name: 'Consigne Salle de bain',
                code:'tag_31_consigne'
            },{
                name: 'Consigne Chambre Parents',
                code:'tag_2_consigne'
            },{
                name: 'Consigne Chambre Nathan',
                code:'tag_3_consigne'
            },{
                name: 'Consigne Chambre Maxime',
                code:'tag_17_consigne'
            },{
                name: 'Consigne Chambre garage',
                code:'tag_37_consigne'
            }
          ],
        
        getdataderver : function (res,variables){
        	var sqlarray=[];
        	var modulo=1;
        	
 
				sqlarray.push({objname:variables.datacode,sql:"select CAST(strftime('%s',timestamp)  AS INT)*1000 as temps,expr1+0 as prod from historique where uuid='"+variables.datacode+"' and _rowid_ % "+modulo+"=0 ;"});
				sqlarray.push({appliqueescalier:true,objname:variables.datacode+"_consigne",sql:"select CAST(strftime('%s',timestamp)  AS INT)*1000 as temps,etat+0 as prod from historique where uuid='"+variables.datacode+"' ;"});


        	
        	
        	var rep={};
				GLOBAL.req.async.map(sqlarray,function(objsql,callbacksql){
					GLOBAL.obj.app.db.sqlorder(objsql.sql,function(rows){
						rep[objsql.objname]=rows;
						callbacksql(null);
					});
				},function(err,result){
					
					for (r in rep) {
						if (rep[r].touslesNpoint && rep[r].touslesNpoint>1) {
							rep[r]=convert_arrayobj_to_arrayarray(rep[r],rep[r].touslesNpoint,rep[r].appliqueescalier);
						} else {
							rep[r]=convert_arrayobj_to_arrayarray(rep[r],null,rep[r].appliqueescalier);
						}
						
					}
					
					var repj = JSON.stringify(rep);
					console.log(repj);
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(repj);
				})
        }
    };


function convert_arrayobj_to_arrayarray(arrayobj,echantillonnage,appliqueescalier){
	var newarray=[];
	var indexechantillon=0;
	if (echantillonnage) indexechantillon=echantillonnage;
	for (r in arrayobj){
		if (indexechantillon>0 ) {
			indexechantillon--
		} else {
			
			
			var ele=[];
			for (p in arrayobj[r]) {
				ele.push(arrayobj[r][p]);		
			}
			if (appliqueescalier && newarray.length>0 && ele.length>1 ){
				var elemod=[];
				elemod.push(newarray[newarray.length-1][0]-1000);
				elemod.push(newarray[newarray.length-1][1]);
				newarray.push(elemod);
			}
			newarray.push(ele);
			if (echantillonnage) indexechantillon=echantillonnage;
		} 

	}
	return newarray;
}
