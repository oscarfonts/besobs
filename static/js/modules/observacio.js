define(['leaflet', 'jquery', 'http', 'bootstrap-datepicker', 'bootstrap-datepicker-ca'], function(L, $, http) {

	var map = L.map('map');
	var center = [41.425, 2.221];
	var zoom = 14;
	var decimals = 5; //number of decimals to show lon/lat
	
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
			// then, we ask for position
			getLocation(setPosition);
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
	
	function getLocation(func) {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(func);
	    } else {
	        console.log("Geolocation is not supported by this browser.");
	    }
	}
	
	// everything is hidden until loaded
	showPage("login");
	$("body").show();
	
	$("#loginForm").on("submit", function(event) {
		/* stop form from submitting normally */
		event.preventDefault();
		
		// we set the user and pwd
		http.auth.set($("#inputUser").val(), $("#inputPassword").val());
		
		http.post("../api/login/").then(loginOK, loginKO);
	});

	function logout() {
		http.auth.clear();
		http.get("../api/logout/").then(function() {
            location = "../";
        }, function() {
            location = "../";
        });
	};
	
	var loginOK = function(response) {
		if(!response) showLoginError("Error en consultar usuari i contrassenya. Torneu-ho a provar si us plau.");
		else {
			if(response.login == "OK") {
				showPage("observacio");
				$("#userId").val(response.user.name);
				$("#logoutLink").text("Surt (" + response.user.name + ")").click(logout).show();
				if(response.user.isAdmin) {
					$("#adminLink").show();
				}
				$('#dataId').datepicker('setDate', new Date());
				$('#dataId').datepicker('update');
			} else {
				showLoginError("Error en consultar usuari i contrassenya. Torneu-ho a provar si us plau.");
			}
		}
	};
	
    function loginKO(error) {
        if (error.code && error.code == 401) {
            message = "Accés denegat. Usuari o password incorrectes.";
        } else {
            message = "S'ha produït un error en comprovar l'usuari.<br/>Contacteu amb l'administrador.";
        }
        showLoginError(message);
        http.auth.clear();
    }
    
    function showLoginError(message) {
    	$("#loginError").html('<div class="alert alert-danger">'+message+'</div>');
    }
    
    function showModal(div, msg) {
    	$(div).modal("show").find(".modal-body").html(msg);
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

		http.post("../api/observacions", data).then(function(response) {
				if(!response) showModal("#modalSuccess", "No s'ha pogut inserir la observació. Disculpeu les molèsties.");
				else showModal("#modalSuccess", "La observació s'ha inserit correctament.");
			}, function(error){
				showModal("#modalSuccess", "S'ha produït un error " + error.code + " en connectar amb el servidor: " + error.error + ". No s'ha pogut inserir la observació. Disculpeu les molèsties.");
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
		xBox.val(latlng.lng.toFixed(decimals));
		yBox.val(latlng.lat.toFixed(decimals));
	});
	//reflect x and y box changes into marker dragging 
	xBox.change(moveMarker);
	yBox.change(moveMarker);
	function moveMarker(e) {
		if($.isNumeric(yBox.val()) && $.isNumeric(xBox.val())) {
			var coords = new L.LatLng(yBox.val(), xBox.val());
			marker.setLatLng(coords);
			map.panTo(coords);
		}
	}
	function setPosition(pos) {
		var crd = pos.coords;
		if(crd) {
			xBox.val(crd.longitude.toFixed(decimals));
			yBox.val(crd.latitude.toFixed(decimals));
			moveMarker();
		}
	}
	
	//species list in plain JSON
	var specieList = $('select#specieId');
	$('select#animalClassId').change(function () {
		$.getJSON('../js/json/' + this.value + '.json',function(data){
		  specieList.html('');
	      $.each(data, function( key, val ) {
		    specieList.append('<option value="' + val + '">' + val + '</option>');
		  });
	    });
	});

	$("#photoId").change(function(){
		$("#photoPath").text(this.value.split("\\").pop());
	});
	
});
