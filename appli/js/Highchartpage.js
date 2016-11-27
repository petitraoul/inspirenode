
var urlhighchartlist='index.php?type=get&action=listhighchart';
var urlhighchartdetail='index.php?type=get&action=detailhighchart&uuid='
var highchartconfig=[];
var highchartcourant={};
	
$(document).on("pagecreate","#highchartpage",function(){ // When entering pagetwo
	setTheme();
	
});
$(document).on("pageshow","#highchartpage",function(){ // When entering pagetwo
	displayWaitHigthcharList();
	
});

/*$('#tagListPage').bind('eventRefreshTags', function(event) {
	displayWaitTags();
});*/

function displayWaitHigthcharList(){
	$('#HightchartList li').remove();
	$('#HightchartList').append('<li data-icon="false"><h4 align="center">Chargement...</h4></li>');
	$('#HightchartList').listview('refresh');
	getJsonObject(displayHigthcharList,urlhighchartlist+'&v='+version);
	//$.getJSON(urltaglist, displayTags);
};

function displayHigthcharList(data) {
	
	
	$('#HightchartList li').remove();
	
	for (h in data){
		var highcharconf=data[h];
		highchartconfig.push(highcharconf);
		
		var html='<li  data-icon="false">'+
			'<a href="#" id="'+highcharconf.uuid+'" ';
		html+=' onclick="chargeHighchart(this,\''+highcharconf.uuid+'\');return false;"';
		html+=    	'>'+
			'<div style="display: inline-block;"><h4 id="nom">'+highcharconf.title.text+'</h4>'+
			'<h6 id="tags" style="font-size: 12px">'+highcharconf.subtitle.text+'</h6></div>'+
			'</a>'+
			'</li>';
		$('#HightchartList').append(html);
	}

	$('#HightchartList').listview('refresh');

	EntetePageTaille('#highchartpage');
	$('#highchartpage').trigger('create');
	
	//$( "#entete" ).children().css( "margin-top", "20px" );
};


var highcharobj={};
function chargeHighchart(element,uuid){
	
	for (h in highchartconfig){
		if (highchartconfig[h].uuid==uuid){
			highchartcourant=highchartconfig[h];
		}
	}
	$.mobile.changePage( $("#highchartpagedetail"), { transition: "slide"});
	if (!highchartcourant.chart) highchartcourant.chart={};
	highchartcourant.chart.renderTo='containerHighChart';
	if (!highchartcourant.loading) highchartcourant.loading={};
	highchartcourant.loading.style={opacity:0.3,backgroundColor:'black'};
	
	highcharobj= new Highcharts.Chart(highchartcourant);
			
	highcharobj.showLoading('Chargement ...');
	
	
	//highcharobj=$('#highchartpagedetail').find('#containerHighChart').highcharts(highchartcourant);
	//highcharobj.showLoading('Chargement des données');
	var needload_withoutdatacode=false;
	for (s in highchartcourant.series){
		if (highchartcourant.series[s].datacode) {
			getJsonObject(displayHigthchart,urlhighchartdetail+uuid+'&datacode='+highchartcourant.series[s].datacode+'&v='+version);
		} else {
			needload_withoutdatacode=true;
		}
	}
	if (needload_withoutdatacode) {
		getJsonObject(displayHigthchart,urlhighchartdetail+uuid+'&v='+version);
	}
	
	
}

function displayHigthchart(data) {
	
	for (s in highcharobj.series){
		for (ds in data){
			if (ds==highcharobj.series[s].options.datacode || ds==highcharobj.series[s].options.code) {
				highcharobj.series[s].setData(data[ds]);
			}
		}
	}
	highcharobj.hideLoading();
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

