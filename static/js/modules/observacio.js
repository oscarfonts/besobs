define(['leaflet', 'jquery', 'http', 'bootstrap-datepicker', 'bootstrap-datepicker-ca'], function(L, $, http) {

	var map = L.map('map');
	var center = [41.425, 2.221];
	var zoom = 14;
	
	var asGeoJSON = function(formValues) {
		var properties = {};
		for (var i in formValues) {
			var prop = formValues[i];
			properties[prop.name] = prop.value;
		}

		var geoJSON = {
			"type": "FeatureCollection",
			"features": [
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [properties.x, properties.y]
					},
					"properties": properties
				}
			]
		};

		delete properties.x;
		delete properties.y;

		return geoJSON;
	};
	
	var showPage = function(id) {
		if(id == "login") {
			$("#loginPage").show();
			$("#observacioPage").hide();
		} else {
			$("#loginPage").hide();
			$("#observacioPage").show();
			// we must set view here because hide and show makes map lose its center
			map.setView(center, zoom);
		}
	};
	
	var checkMandatory = function(fields, scroll) {
		var result = [];
		for (var i = 0; i < fields.length; i ++) {
			var field = $("#" + fields[i]);
			if(!field.val()) {
				field.parent().addClass("has-error");
				//if first result, scroll there
				if(scroll && result.indexOf(false) == -1) {
					$('html, body').animate({
				        scrollTop: field.offset().top
				    }, 1000);
				}
				result[i] = false;
			} else {
				field.parent().removeClass("has-error");
				result[i] = true;
			}
		}
		return result;
	};
	
	showPage("login");
		
	$("#loginForm").on("submit", function(event) {
		/* stop form from submitting normally */
		event.preventDefault();
		
		// we set the user and pwd
		http.auth.set($("#inputUser").val(), $("#inputPassword").val());
		
		http.post("/api/login/").then(loginOK, loginKO);
	});
	
	var loginOK = function(response) {
		if(!response) alert("Didn't return anything!");
		else {
			if(response.login == "OK") {
				showPage("observacio");
				$("#userId").val($("#inputUser").val());
			} else {
				alert("Wrong user/password");
			}
		}
	};
	
    function loginKO(error) {
        if (error.code && error.code == 401) {
            message = "Accés denegat. Usuari o password incorrectes.";
        } else {
            message = "S'ha produït un error en comprovar l'usuari.<br/>Contacteu amb l'administrador.";
        }
        $("#loginError").html('<div class="alert alert-danger">'+message+'</div>');
        http.auth.clear();
    }	

	$("#observacioForm").on("submit", function(event) {
		/* stop form from submitting normally */
		event.preventDefault();
		
		//form validation
		var mandatoryFields = ["dataId", "xId", "yId", "animalClassId", "specieId"];
		var checked = checkMandatory(mandatoryFields, true);
		//if one of the mandatory fields is missing, cancel the form submission
		if(checked.indexOf(false) != -1) return false;

		//we build the post data manually to set our geojson structure
		var data = new FormData();
		var fileInput = $("#photoId");
		data.append("file", fileInput[0].files[0]);
		data.append("geojson", JSON.stringify(asGeoJSON($(this).serializeArray())));

		http.post("api/observacions", data).then(function(response) {
				if(!response) alert("Didn't return anything!");
				else $("#modalSuccess").modal("show");
			}, function(error){
				alert("There was an error " + error.code + ": " + error.error);
		});
	});
	
    //datepicker stuff
    $('.datepicker').datepicker({
    	format: 'yyyy-mm-dd',
    	language: 'ca-ES' 
    });
    
    //map stuff
    var Hydda_Full = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
		attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	var marker = L.marker(new L.LatLng(41.425, 2.221), {
	    draggable: true
	}).addTo(map);
	//reflect marker dragging into x and y boxes
	var xBox = $('#xId');
	var yBox = $('#yId');
	marker.on('dragend', function (e) {
		var latlng = e.target.getLatLng();
		xBox.val(latlng.lng.toFixed(5));
		yBox.val(latlng.lat.toFixed(5));
	});
	//reflect x and y box changes into marker dragging 
	xBox.change(moveMarker);
	yBox.change(moveMarker);
	function moveMarker(e) {
		if($.isNumeric(yBox.val()) && $.isNumeric(xBox.val())) marker.setLatLng(new L.LatLng(yBox.val(), xBox.val()));
	}
	
	//species list in plain JSON
	var specieList = $('select#specieId');
	$('select#animalClassId').change(function () {
		$.getJSON('js/json/' + this.value + '.json',function(data){
		  specieList.html('');
	      $.each(data, function( key, val ) {
		    specieList.append('<option value="' + val + '">' + val + '</option>');
		  });
	    })
	});
	
});