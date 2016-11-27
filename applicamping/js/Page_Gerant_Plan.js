
var mapplan=null;
var click=false;
var clickEmpl=null;
var createEmpl=false;
$(document).on("pageshow","#Gerant_Plan_Page",function(){ // When entering pagetwo
	mapplan._onResize();
	
});
$(document).on("pagecreate","#Gerant_Plan_Page",function(){ // When entering pagetwo
	
	
	var map = L.map('map', {
		  minZoom: 0.4,
		  maxZoom: 4,
		  center: [1, 1],
		  zoom: 0.4,
		  crs: L.CRS.Simple
		});
		// dimensions of the image
		var w = 4933,
		    h = 3508,
		    url = '/images/plan_camping.jpg';

		// calculate the edges of the image, in coordinate space
		var southWest = map.unproject([0, h], map.getMaxZoom()-1);
		var northEast = map.unproject([w, 0], map.getMaxZoom()-1);
		var bounds = new L.LatLngBounds(southWest, northEast);
		
		L.imageOverlay(url, bounds).addTo(map);
		///

		map.setMaxBounds(bounds);
		
		// tell leaflet that the map is exactly as big as the image
		
		
		map.on('click', function(e) {
			//console.log(e.latlng);
			$("#container_periph").hide();
			if (clickEmpl) {
				clickEmpl.setOpacity(0.3);
				click=false;				
			}

			console.log(map.project([e.latlng.lat,e.latlng.lng],map.getMaxZoom()-1));
			if (e.originalEvent.ctrlKey==true) {
				/*création d'un emplacement*/
				CreateEmplacement(map.project([e.latlng.lat,e.latlng.lng],map.getMaxZoom()-1));
				$("#container_periph").show();
			}
			
		});	
		mapplan=map;
		//getJsonObject(affiche_circuit_personnel,'index.php?action=circuitpersonnel&v='+version);
		getJsonObject(affiche_icon_emplacement,'index.php?action=listtagplan&v='+version);
		

});

function affiche_circuit_personnel(data){

	var selection = null;
	var personnel_id=-1;
	for (i in data) {
		if (data[i].personnel!=personnel_id && selection) {
			var polyline = L.polyline(selection, {color: 'red'}).addTo(mapplan);
			selection=[];
		}
		personnel_id=data[i].personnel;
		if (!selection) selection=[];
		var latlng=mapplan.unproject([data[i].position_x, data[i].position_y],mapplan.getMaxZoom()-1);
		selection.push(latlng);
	}
	
	if (selection) {
		var polyline = L.polyline(selection, {color: 'red'}).addTo(mapplan);
	}
	

}

function affiche_icon_emplacement(tags){
	
	$.each(tags,function(index,tag){
		if (tag.position_x && tag.position_y){
			var EmpIcon=null;
			if (tag.nb_probleme_tech>0) {
				EmpIcon = L.icon({
				    iconUrl: '/'+tag.icon,
				    shadowUrl: '/'+tag.icon_probleme,
				    iconSize:     [30, 30], // size of the icon
				    shadowSize:   [20, 20], // size of the shadow*/
				    iconAnchor:   [15, 18], // point of the icon which will correspond to marker's location
				    shadowAnchor: [12, 12],  // the same for the shadow*/
				    popupAnchor:  [0, -5] // point from which the popup should open relative to the iconAnchor
				});
			} else {
				EmpIcon = L.icon({
				    iconUrl: '/'+tag.icon,
				    iconSize:     [30, 30], // size of the icon
				    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
				    popupAnchor:  [0, -5] // point from which the popup should open relative to the iconAnchor
				});
			}
			
			var Empl=L.marker(mapplan.unproject([tag.position_x, tag.position_y],mapplan.getMaxZoom()-1),
					{icon: EmpIcon,
					 opacity: (0.5*tag.occupe),
					 opacityshadow:1,
					 tag: tag})
			extendLeaflet_marker(Empl);
			Empl.addTo(mapplan)
			//mobilehome.setPopupContent("<b>I'm a dog!</b><br />I am a popup.<br /> ");

			
			Empl.on('mouseover', function(e) {
				if (click==false && createEmpl==false) {
					Empl.setOpacity(1);
					$("#container_periph").show();
					chargeInfo(Empl);
				}

				//mobilehome.openPopup();
			});
			Empl.on('mouseout', function(e) {
				if (click==false && createEmpl==false) {
					Empl.setOpacity(0.5*Empl.options.tag.occupe);
					$("#container_periph").hide();					
				}
				//mobilehome.closePopup();
			});	
			Empl.on('click', function(e) {
				//mapplan.panTo(e.latlng);
				createEmpl=false;
				if (clickEmpl && clickEmpl!=Empl) {
					clickEmpl.setOpacity(0.5*clickEmpl.options.tag.occupe);
					click=false;
					chargeInfo(Empl);
					chargePeriph(Empl);
				}
				if (click==false) {
					click=true;
					clickEmpl=Empl;
					Empl.setOpacity(1);
					chargePeriph(Empl);
					$("#container_periph").show();					
				} else if (clickEmpl && clickEmpl==Empl){
					clickEmpl.setOpacity(0.5*clickEmpl.options.tag.occupe);
					click=false;
					$("#container_periph").hide();	
				}
				//mobilehome.closePopup();
			});	
		}
	
	});
	$('#Gerant_Plan_Page').trigger('resize');
}

function chargeInfo(EmplMarker){
	getJsonObject(function(data){
		var user=data.user;
		if (user && user.nom!=null) {
			var htmlinfo="<li><div style='display:inline-block'><img style = 'float:left;' id='icon' src='"+imagesURL+EmplMarker.options.tag.icon+"' height='60' width='60'/>"+
			"<h4> Emplacement "+EmplMarker.options.tag.nom+"</h4>"
			htmlinfo+="<p><b>"+user.nom+" "+user.prenom+"</b></br>du "+user.premier_jour+"	 </br>au "+user.dernier_jour+"</p></div></li>"
			
		} else {
			var htmlinfo='<li><div style="display:inline-block"><img style = "float:left;"id="icon" src="'+imagesURL+EmplMarker.options.tag.icon+'" height="60" width="60"/>'+
			"<h4> Emplacement "+EmplMarker.options.tag.nom+"</h4>"
			htmlinfo+="<p><b>Disponible actuellement</b></div></li>"
			
		}
		if (user.probleme_commentaire) {
			htmlinfo+='<li><div style="display:inline-block"><img style = "float:left;"id="icon" src="'+imagesURL+EmplMarker.options.tag.icon_probleme+'" height="50" width="50"/>'+
			"<h4 style='color:red'>"+user.probleme_commentaire+"</h4>"
			htmlinfo+="</div></li>"
		}
		$("#container_periph").find("#infos li").remove();
		$("#container_periph").find("#infos").append($(htmlinfo));	
		$("#container_periph").find("#infos").listview('refresh');
		try {
			$("#container_periph").find("#periphs li").remove().listview('refresh');
		} catch (e) {
			// TODO: handle exception
		}
	},'index.php?action=userofempl&uuid='+EmplMarker.options.tag.uuid+'&v='+version);
	
}
function chargePeriph(EmplMarker){
	var listview=$("#container_periph").find("#periphs");
	$("#container_periph").find("#periphs li").remove()
	$("#container_periph").find("#periphs").listview('refresh');
	displayPeriphInLists('#container_periph','#periphs','#periphs','#periphs',null,null,EmplMarker.options.tag.uuid,'a');
	$("#container_periph").find("#periphslists").show();	
	
}

function CreateEmplacement(Point){
	createEmpl=true;
			var htmlinfo='<li><div data-role="fieldcontain">';
			htmlinfo+='<label for="Code_emplacement">Code_emplacement:</label>';
			htmlinfo+='<input  name="Code_emplacement" id="Code_emplacement" value="000"></input>'
			htmlinfo+='<label for="pos_x">Position x:</label>';
			htmlinfo+='<input  name="pos_x" id="pos_x" value="'+Point.x+'"></input>';
			htmlinfo+='<label for="pos_y">Position y:</label>';
			htmlinfo+='<input  name="pos_y" id="pos_y" value="'+Point.y+'"></input>';
			htmlinfo+='<label for="icon">Icone:</label>';
			htmlinfo+='<input  name="icon" id="cicon" value="'+'images/mobilehome.png'+'"></input>';
			htmlinfo+='</div></li>';
		
			htmlinfo+='<li><div data-role="fieldcontain">';
			htmlinfo+='<button id="creer" onclick="creerEmpl();">Enregistrer</button>';
			htmlinfo+='<button id="annuler" onclick="closeCreateEmpl();">Annuler</button>';
			htmlinfo+='</div></li>';
		$("#container_periph").find("#infos li").remove();
		$("#container_periph").find("#infos").append($(htmlinfo));	
		$("#container_periph").find("#infos").listview('refresh');
		$("#container_periph").find("#periphs li").remove().listview('refresh');
	
	
}
function creerEmpl(){
	var obj={};
	obj.code=$("#container_periph").find("#Code_emplacement").val();
	obj.posx=$("#container_periph").find("#pos_x").val();
	obj.posy=$("#container_periph").find("#pos_y").val();
	obj.icon=$("#container_periph").find("#cicon").val();
	getJsonObject(function(data){
		closeCreateEmpl();
		},'index.php?action=PlanCreerEmpl&v='+version,obj);
}
function closeCreateEmpl(){
	
	$("#container_periph").find("#infos li").remove();
	$("#container_periph").find("#infos").listview('refresh');
	$("#container_periph").hide();	
}

function extendLeaflet_marker(Empl){
	Empl.setOpacityShadow =function (opacityshadow) {
		this.options.opacityshadow = opacityshadow;
		if (this._map) {
			this._updateOpacity();
		}

		return this;
	};
	
	Empl._updateOpacity= function () {
		L.DomUtil.setOpacity(this._icon, this.options.opacity);
		if (this._shadow) {
			if (this.options.opacityshadow)	L.DomUtil.setOpacity(this._shadow, this.options.opacityshadow);
			else if (this.options.opacityshadow)	L.DomUtil.setOpacity(this._shadow, this.options.opacity);
		}
	};

	mapplan.on('zoomend',function(type,obj){
		if (!Empl.options.icon.options.iconSizeOrigin) {
			Empl.options.icon.options.iconSizeOrigin=Empl.options.icon.options.iconSize;
			Empl.options.icon.options.shadowSizeOrigin=Empl.options.icon.options.shadowSize;
			Empl.options.icon.options.iconAnchorOrigin=Empl.options.icon.options.iconAnchor;
			Empl.options.icon.options.shadowAnchorOrigin=Empl.options.icon.options.shadowAnchor;
		}
		
		var zoom=mapplan.getZoom()+0.6;
		Empl.options.icon.options.iconSize=[Empl.options.icon.options.iconSizeOrigin[0]*zoom,Empl.options.icon.options.iconSizeOrigin[1]*zoom];
		Empl.options.icon.options.iconAnchor=[Empl.options.icon.options.iconAnchorOrigin[0]*zoom,Empl.options.icon.options.iconAnchorOrigin[1]*zoom];
		if (Empl.options.icon.options.shadowSizeOrigin) {
			Empl.options.icon.options.shadowSize=[Empl.options.icon.options.shadowSizeOrigin[0]*zoom,Empl.options.icon.options.shadowSizeOrigin[1]*zoom];
			Empl.options.icon.options.shadowAnchor=[Empl.options.icon.options.shadowAnchorOrigin[0]*zoom,Empl.options.icon.options.shadowAnchorOrigin[1]*zoom];
			
		}
		/*Empl.options.icon.options.iconSize=[40*mapplan.getZoom()/0.2,40*mapplan.getZoom()/0.2];
		Empl.options.icon.options.iconSize=[40*mapplan.getZoom()/0.2,40*mapplan.getZoom()/0.2];
		Empl.options.icon.options.iconSize=[40*mapplan.getZoom()/0.2,40*mapplan.getZoom()/0.2];*/

		Empl.setIcon(Empl.options.icon);
	});
}
