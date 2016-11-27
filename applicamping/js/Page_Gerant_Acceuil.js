

$(document).on("pagecreate","#Gerant_Acceuil_Page",function(){ // When entering pagetwo
	diplayHighchartAccueil("#Gerant_Acceuil_Page");
	runboucleEtat();
});


function diplayHighchartAccueil(page){ // When entering pagetwo
	setTheme();
	/*highchart Gauche 1er*/
	serieG1=[{name: '2014', data: [100, 300, 50] }, 
	         {name: '2015', data: [95, 310, 52] }   ];
	renderhighchart1($(page).find('#containerG1'),serieG1);
	
	
	/*highchart Gauche 2eme*/
	serieG2=[{name: 'Commun', data: [500, 600, 700, 800, 820, 1500, 2500, 3000, 820, 500, 500, 500]  }, 
	         {name: 'Centre aquatique', data: [520, 620, 720, 820, 2500, 6000, 6500, 3500, 800, 520, 530, 540] }, 
	         {name: 'Hebergement',   data: [550, 650, 750, 850, 870, 2000, 3500, 4000, 870, 560, 550, 500] }];
	renderhighchart2($(page).find('#containerG2'),serieG2);
	
	
	/*highchart Droite 1er*/
	serieG3=null;
	renderhighchart3($(page).find('#containerD1'),serieG3);
	
	
	
	/*highchart Droite 2eme*/
	serieG4=[{type: 'pie', name: 'Charges', data: [	['Credits',   35.0], 
	                                                     	['Electricite',       26.8],
							                             	{ name: 'Eau', y: 12.8, sliced: true, selected: true  },
							                             	['Animation',    18.5],
											            	['Autres',   6.7]
							                             ]
    					}];
	renderhighchart4($(page).find('#containerD2'),serieG4);
};


function diplayHighchartBatiment(page,tag_uuid){
	switch (tag_uuid) {
		case 'c1bb353655feab4ed73b0f9a029b7d':
			serieG1=[{name: 'Jane', data: [1, 0, 4] } ];
			serieG2=[{name: 'Tokyo', data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]  }   ];
			serieD1=null;
			serieD2=[{type: 'pie', name: 'Browser share', data: [	['Firefox',   45.0]       ]	}];
			break;
		case '76e508ad876ed20df08691896c0795':
			serieG1=[{name: 'Tom', data: [1, 0, 4] } ];
			serieG2=[{name: 'Paris', data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]  }   ];
			serieD1=null;
			serieD2=[{type: 'pie', name: 'Browser share', data: [	['Chrome',   30.0]       ]	}];
			break;
		default:
			serieG1=[ ];
			serieG2=[ ];
			serieD1=[ ];
			serieD2=[ ];
			break;
	}
	
	/*highchart Gauche 1er*/
	renderhighchart1($(page).find('#containerG1'),serieG1);	
	/*highchart Gauche 2eme*/
	renderhighchart2($(page).find('#containerG2'),serieG2);
	/*highchart Droite 1er*/
	renderhighchart3($(page).find('#containerD1'),serieD1);
	/*highchart Droite 2eme*/
	renderhighchart4($(page).find('#containerD2'),serieD2);
};



function renderhighchart1(container,serie) {		
	$(function () {
	    container.highcharts({
	        chart: {
	            type: 'bar'
	        },
	        title: {
	            text: 'Consommations Electriques'
	        },
	        xAxis: {
	            categories: ['Commun', 'Centre aquatique', 'Hebergements']
	        },
	        yAxis: {
	            title: {
	                text: 'kW'
	            }
	        },
	        series: serie,
	    });
	
	});
}



function renderhighchart2(container,serie) {		
	$(function () {
	    container.highcharts({
	        title: {
	            text: "Consommation d'eau par mois",
	            x: -20 //center
	        },
	        subtitle: {
	            text: '',
	            x: -20
	        },
	        xAxis: {
	            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	        },
	        yAxis: {
	            title: {
	                text: 'Litre (L)'
	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]
	        },
	        tooltip: {
	            valueSuffix: 'L'
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        },
	        series: serie
	    });
	});
}

function renderhighchart3(container,serie) {
	$(function () {
	    $(document).ready(function () {
	        Highcharts.setOptions({
	            global: {
	                useUTC: false
	            }
	        });

	        container.highcharts({
	            chart: {
	                type: 'spline',
	                animation: Highcharts.svg, // don't animate in old IE
	                marginRight: 10,
	                events: {
	                    load: function () {

	                        // set up the updating of the chart each second
	                        var series = this.series[0];
	                        setInterval(function () {
	                            var x = (new Date()).getTime(), // current time
	                                y = Math.random();
	                            series.addPoint([x, y], true, true);
	                        }, 1000);

	                    }
	                }
	            },
	            title: {
	                text: 'Production solaire en direct'
	            },
	            xAxis: {
	                type: 'datetime',
	                tickPixelInterval: 150
	            },
	            yAxis: {
	                title: {
	                    text: 'Value'
	                },
	                plotLines: [{
	                    value: 0,
	                    width: 1,
	                    color: '#808080'
	                }]
	            },
	            tooltip: {
	                formatter: function () {
	                    return '<b>' + this.series.name + '</b><br/>' +
	                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
	                        Highcharts.numberFormat(this.y, 2);
	                }
	            },
	            legend: {
	                enabled: false
	            },
	            exporting: {
	                enabled: false
	            },
	            series: [{name: 'Random data1',
			        data: (function () {
			            // generate an array of random data
			            var data = [],
			                time = (new Date()).getTime(),
			                i;
			            for (i = -19; i <= 0; i += 1) {
			                data.push({
			                    x: time + i * 1000,
			                    y: Math.random()
			                });
			            }
			            return data;
			        }())
			    }   ]
	        });
	    });
	});
}


function renderhighchart4(container,serie) {		

	$(function () {
	    container.highcharts({
	        chart: {
	            type: 'pie',
	            options3d: {
	                enabled: true,
	                alpha: 45,
	                beta: 0
	            }
	        },
	        title: {
	            text: 'Repartition des Charges 2015'
	        },
	        tooltip: {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                depth: 35,
	                dataLabels: {
	                    enabled: true,
	                    format: '{point.name}'
	                }
	            }
	        },
	        series: serie
	    });
	});
	
}



function setTheme() {		

	/**
	 * Dark theme for Highcharts JS
	 * @author Torstein Honsi
	 */

	// Load the fonts
	Highcharts.createElement('link', {
	   href: '//fonts.googleapis.com/css?family=Unica+One',
	   rel: 'stylesheet',
	   type: 'text/css'
	}, null, document.getElementsByTagName('head')[0]);

	Highcharts.theme = {
	   colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
	      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
	   chart: {
	      backgroundColor: {
	         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
	         stops: [
	            [0, '#2a2a2b'],
	            [1, '#3e3e40']
	         ]
	      },
	      style: {
	         fontFamily: "'Unica One', sans-serif"
	      },
	      plotBorderColor: '#606063'
	   },
	   title: {
	      style: {
	         color: '#E0E0E3',
	         textTransform: 'uppercase',
	         fontSize: '20px'
	      }
	   },
	   subtitle: {
	      style: {
	         color: '#E0E0E3',
	         textTransform: 'uppercase'
	      }
	   },
	   xAxis: {
	      gridLineColor: '#707073',
	      labels: {
	         style: {
	            color: '#E0E0E3'
	         }
	      },
	      lineColor: '#707073',
	      minorGridLineColor: '#505053',
	      tickColor: '#707073',
	      title: {
	         style: {
	            color: '#A0A0A3'

	         }
	      }
	   },
	   yAxis: {
	      gridLineColor: '#707073',
	      labels: {
	         style: {
	            color: '#E0E0E3'
	         }
	      },
	      lineColor: '#707073',
	      minorGridLineColor: '#505053',
	      tickColor: '#707073',
	      tickWidth: 1,
	      title: {
	         style: {
	            color: '#A0A0A3'
	         }
	      }
	   },
	   tooltip: {
	      backgroundColor: 'rgba(0, 0, 0, 0.85)',
	      style: {
	         color: '#F0F0F0'
	      }
	   },
	   plotOptions: {
	      series: {
	         dataLabels: {
	            color: '#B0B0B3'
	         },
	         marker: {
	            lineColor: '#333'
	         }
	      },
	      boxplot: {
	         fillColor: '#505053'
	      },
	      candlestick: {
	         lineColor: 'white'
	      },
	      errorbar: {
	         color: 'white'
	      }
	   },
	   legend: {
	      itemStyle: {
	         color: '#E0E0E3'
	      },
	      itemHoverStyle: {
	         color: '#FFF'
	      },
	      itemHiddenStyle: {
	         color: '#606063'
	      }
	   },
	   credits: {
	      style: {
	         color: '#666'
	      }
	   },
	   labels: {
	      style: {
	         color: '#707073'
	      }
	   },

	   drilldown: {
	      activeAxisLabelStyle: {
	         color: '#F0F0F3'
	      },
	      activeDataLabelStyle: {
	         color: '#F0F0F3'
	      }
	   },

	   navigation: {
	      buttonOptions: {
	         symbolStroke: '#DDDDDD',
	         theme: {
	            fill: '#505053'
	         }
	      }
	   },

	   // scroll charts
	   rangeSelector: {
	      buttonTheme: {
	         fill: '#505053',
	         stroke: '#000000',
	         style: {
	            color: '#CCC'
	         },
	         states: {
	            hover: {
	               fill: '#707073',
	               stroke: '#000000',
	               style: {
	                  color: 'white'
	               }
	            },
	            select: {
	               fill: '#000003',
	               stroke: '#000000',
	               style: {
	                  color: 'white'
	               }
	            }
	         }
	      },
	      inputBoxBorderColor: '#505053',
	      inputStyle: {
	         backgroundColor: '#333',
	         color: 'silver'
	      },
	      labelStyle: {
	         color: 'silver'
	      }
	   },

	   navigator: {
	      handles: {
	         backgroundColor: '#666',
	         borderColor: '#AAA'
	      },
	      outlineColor: '#CCC',
	      maskFill: 'rgba(255,255,255,0.1)',
	      series: {
	         color: '#7798BF',
	         lineColor: '#A6C7ED'
	      },
	      xAxis: {
	         gridLineColor: '#505053'
	      }
	   },

	   scrollbar: {
	      barBackgroundColor: '#808083',
	      barBorderColor: '#808083',
	      buttonArrowColor: '#CCC',
	      buttonBackgroundColor: '#606063',
	      buttonBorderColor: '#606063',
	      rifleColor: '#FFF',
	      trackBackgroundColor: '#404043',
	      trackBorderColor: '#404043'
	   },

	   // special colors for some of the
	   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
	   background2: '#505053',
	   dataLabelsColor: '#B0B0B3',
	   textColor: '#C0C0C0',
	   contrastTextColor: '#F0F0F3',
	   maskColor: 'rgba(255,255,255,0.3)'
	};

	// Apply the theme
	Highcharts.setOptions(Highcharts.theme);
}

