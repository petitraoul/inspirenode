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
            text: 'Source: 8 rue du calvaire',
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
            	name: 'Hall',
            	datacode:'tag_27'
            },{
                name: 'Hall consigne',
                code:'tag_27_consigne'
            },{
                name: 'Salle à manger',
                datacode:'tag_19'
            },{
                name: 'Zone nuit',
                datacode:'tag_9'
            },{
                name: 'Extérieur',
                datacode:'tag_34'
            }
          ],
        
        getdataderver : function (res,variables){
        	var sqlarray=[];
        	var modulo=1;

				sqlarray.push({objname:variables.datacode,sql:"select CAST(strftime('%s',timestamp)  AS INT)*1000 as temps,expr1+0 as prod from historique where julianday('now') - julianday(timestamp)<8 and uuid='"+variables.datacode+"' and _rowid_ % "+modulo+"=0 order by CAST(strftime('%s',timestamp)  AS INT) ;"});
				sqlarray.push({objname:variables.datacode+"_consigne",sql:"select CAST(strftime('%s',timestamp)  AS INT)*1000 as temps,etat+0 as prod from historique where julianday('now') - julianday(timestamp)<8 and  uuid='"+variables.datacode+"' order by CAST(strftime('%s',timestamp)  AS INT) ;"});


        	
        	
        	var rep={};
				GLOBAL.req.async.map(sqlarray,function(objsql,callbacksql){
					GLOBAL.obj.app.db.sqlorder([objsql.sql],function(rows){
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
				elemod.push(newarray[newarray.length-1][0]);
				elemod.push(ele[1]);
				newarray.push(elemod);
			}
			newarray.push(ele);
			if (echantillonnage) indexechantillon=echantillonnage;
		} 

	}
	return newarray;
}
