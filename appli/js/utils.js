

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getInfoMemo(key,valdefault){
	try {
		valdefault =valdefault.trim();
	} catch (e) {
	}
	if (window.localStorage.getItem(key)==null) {
		setInfoMemo(key, valdefault);
		return valdefault;
	} else {
		return window.localStorage.getItem(key);
	}
}

function setInfoMemo(key,valeur){
	
	try {
		valeur =valeur.trim();
	} catch (e) {
	}
	window.localStorage.setItem(key, valeur);

}
function isitdevice(){
	return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
}
function findobjinarray(array,propertie,value){
	
	for (e in array){
		var obj=array[e];
		if(obj[propertie] && obj[propertie]==value){
			return array[e];
		}
	}
	return null;
}
function EntetePageTaille(pageelement){
	
	if (typeof device != "undefined" && device.platform!="Android"){
		$( pageelement ).find("#entete").children().css( "margin-top", "20px" );
	} else {
		$( pageelement ).find('#settingbutton').hide();
	}
}