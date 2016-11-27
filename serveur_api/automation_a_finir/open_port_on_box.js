/**
 * New node file
 */
var open_port_on_box={id:21,nom:"open_port_on_box",etat:"OFF",lastrun:null};
var timer=null;



open_port_on_box.start=function(){
	if (open_port_on_box.etat=='OFF') {
		open_port_on_box.etat='ON';
		/*Execution toutes les  5 minutes*/
		timer=setInterval(function(){
			open_port();
				/*http://www.inspirelec.com/adr/dnsdynamic.php?id='  obj.app.core.findobj('id_installation','constantes');*/
			}, 300000);
		open_port();
	}
}

open_port_on_box.stop=function(){
	if (open_port_on_box.etat=='ON') {
		open_port_on_box.etat='OFF';
		
		clearInterval(timer);
	}

}

function open_port(){
	var natpmp = GLOBAL.req.natpmp;

	// create a "client" instance connecting to your local gateway
	var client = natpmp.connect('192.168.1.10');


	// explicitly ask for the current external IP address
	client.externalIp(function (err, info) {
	  if (err) throw err;
	  console.log('Current external IP address: %s', info.ip.join('.'));
	});


	// setup a new port mapping
	client.portMapping({ private: 1340, public: 1340, ttl: 3600 }, function (err, info) {
	  if (err) throw err;
	  console.log(info);
	  // {
	  //   type: 'tcp',
	  //   epoch: 8922109,
	  //   private: 22,
	  //   public: 2222,
	  //   ...
	  // }
	});
	
	

}




module.exports = open_port_on_box;