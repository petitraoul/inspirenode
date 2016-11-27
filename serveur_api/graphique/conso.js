/**
 * New node file
 */

module.exports=

        {
        title: {
            text: 'EDF wh instantané',
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
                text: 'EDF en wh'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'wh'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            	name: 'Production EDF',
            	datacode:'production'
            },{
                name: 'Consommation EDF',
                datacode:'consommation'
            }/*,{
                name: 'Consommation Chauffe eau',
                datacode:'consochauffeeau'
            }*/
          ],
        
        getdataderver : function (res,variables){
        	var sqlarray=[];
        	var modulo=20;
        	switch (variables.datacode) {
			case 'production':
				sqlarray.push({objname:"production",sql:"select CAST(strftime('%s',datetime(timestamp))  AS INT)*1000 as temps,expr1+0 as prod from historique where  julianday('now') - julianday(timestamp)<30 and uuid='934a73c47ca93ff78c98641ba5b7b3' and _rowid_ % "+modulo+"=0 order by CAST(strftime('%s',datetime(timestamp))  AS INT) ;"});
				
				break;
			case 'consommation':
				sqlarray.push({objname:"consommation",sql:"select CAST(strftime('%s',datetime(timestamp))  AS INT)*1000 as temps,expr1+0 as prod from historique where  julianday('now') - julianday(timestamp)<30 and uuid='2a739b638a427960e72ac74a558c82' and _rowid_ % "+modulo+"=0 order by CAST(strftime('%s',datetime(timestamp))  AS INT);"});
				break;
			/*case 'consochauffeeau':
				sqlarray.push({objname:"consochauffeeau",sql:"select CAST(strftime('%s',datetime(timestamp))  AS INT)*1000 as temps,expr1+0 as prod from historique where  julianday('now') - julianday(timestamp)<30 and uuid='dfd15553caf75d02e01ed2ac272782' and _rowid_ % "+modulo+"=0 order by CAST(strftime('%s',datetime(timestamp))  AS INT);"});
				break;*/
			default:
				break;
			}

        	/*traitement requetes et envoi de sdonnées*/
				var rep={};
				GLOBAL.req.async.map(sqlarray,function(objsql,callbacksql){
					console.log(objsql + 'sqlexecuted' + req.moment().format('DD/MM/YY HH:mm:ss'));
					GLOBAL.obj.app.db.sqlorder([objsql.sql].sql,function(rows){
						rep[objsql.objname]=rows;
						callbacksql(null);
					});
				},function(err,result){
					console.log('sqlfetched' + req.moment().format('DD/MM/YY HH:mm:ss'));
					for (r in rep) {
						if (rep[r].touslesNpoint && rep[r].touslesNpoint>1) {
							rep[r]=convert_arrayobj_to_arrayarray(rep[r],rep[r].touslesNpoint);
						} else {
							rep[r]=convert_arrayobj_to_arrayarray(rep[r]);
						}
						
					}
					console.log('data transformed' + req.moment().format('DD/MM/YY HH:mm:ss'));

					
					var repj = JSON.stringify(rep);
					console.log('data stringyfied' + req.moment().format('DD/MM/YY HH:mm:ss'));
					res.writeHead(200, 
								{'Content-Type': 'text/plain',
								 'Access-Control-Allow-Origin': '*'});
					res.end(repj);
					console.log('data sended' + req.moment().format('DD/MM/YY HH:mm:ss'));
				})
        }
    };


function convert_arrayobj_to_arrayarray(arrayobj,echantillonnage){
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
			newarray.push(ele);
			if (echantillonnage) indexechantillon=echantillonnage;
		} 

	}
	return newarray;
}
