/**
 * New node file
 */

module.exports=

        {
        title: {
            text: 'Energies en euro par mois',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: 8 rue du calvaire',
            x: -20
        },
		chart: {
            zoomType: 'x',
            type: 'column'
        },
        xAxis: {
            type: 'datetime',            
			startOnTick: false,
			minRange: 1 * 3600000 
        },
        yAxis: {
            title: {
                text: 'euros'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'euro'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
		plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            	name: 'Eau',
            	datacode:'eau',
            	stack: 'eau'
            },{
                name: 'Edf HC',
                datacode:'edfhc',
                stack: 'conso'
            },{
                name: 'Edf HP',
                datacode:'edfhp',
                stack: 'conso'
            },{
                name: 'Chauffe eau',
                datacode:'chauffeeau',
                stack: 'chaufeau'
            },{
                name: 'Panneaux',
                datacode:'panneaux',
                stack: 'prod'
            }
          ],
        
        getdataderver : function (res,variables){
        	
        	var sqlarray=[];
        	switch (variables.datacode) {
			case 'eau':
				sqlarray.push({objname:"eau",sql:"select CAST(strftime('%s',date(min(timestamp),'start of month')) as INT)*1000 tim, (max(expr1+0)-min(expr1+0))*0.0041197087378641 ecart from historique where uuid='60355a864d2e9a4df7c5904d13f832' and expr1+0>1 group by strftime('%Y%m',timestamp) order by strftime('%Y%m',timestamp);"});
				break;
			case 'edfhc':
				sqlarray.push({objname:"edfhc",sql:"select CAST(strftime('%s',date(min(timestamp),'start of month')) as INT)*1000 tim, (max(expr2+0)-min(expr2+0))*0.10866352 ecart from historique where uuid='2a739b638a427960e72ac74a558c82' and expr2+0>10000 group by strftime('%Y%m',timestamp) order by strftime('%Y%m',timestamp);"});
				break;
			case 'edfhp':
				sqlarray.push({objname:"edfhp",sql:"select CAST(strftime('%s',date(min(timestamp),'start of month')) as INT)*1000 tim, (max(expr3+0)-min(expr3+0))*0.1718908 ecart from historique where uuid='2a739b638a427960e72ac74a558c82' and expr3+0>10000  group by strftime('%Y%m',timestamp) order by strftime('%Y%m',timestamp) ;"});
				break;
			case 'chauffeeau':
				sqlarray.push({objname:"chauffeeau",sql:"select CAST(strftime('%s',date(min(timestamp),'start of month')) as INT)*1000 tim, (max(expr1+0)-min(expr1+0))*0.10866352 ecart from historique where uuid='dfd15553caf75d02e01ed2ac272782' /*and expr1+0>10000*/ group by strftime('%Y%m',timestamp) order by strftime('%Y%m',timestamp);"});
				break;
			case 'panneaux':
				sqlarray.push({objname:"panneaux",sql:"select CAST(strftime('%s',date(min(timestamp),'start of month')) as INT)*1000 tim, max(expr3+0)-min(expr3+0) ecart from historique where uuid='934a73c47ca93ff78c98641ba5b7b3' and expr3+0>200   group by strftime('%Y%m',timestamp) order by strftime('%Y%m',timestamp);"});
				break;
			default:
				break;
			}

				var rep={};
				GLOBAL.req.async.map(sqlarray,function(objsql,callbacksql){
					GLOBAL.obj.app.db.sqlorder([objsql.sql],function(rows){
						rep[objsql.objname]=rows;
						callbacksql(null);
					});
				},function(err,result){
					
					
					for (r in rep) {
						if (rep[r].touslesNpoint && rep[r].touslesNpoint>1) {
							rep[r]=convert_arrayobj_to_arrayarray(rep[r],rep[r].touslesNpoint);
						} else {
							rep[r]=convert_arrayobj_to_arrayarray(rep[r]);
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
