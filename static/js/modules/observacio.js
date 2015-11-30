define(['leaflet', 'jquery', 'http', 'bootstrap-datepicker', 'bootstrap-datepicker-ca'], function(L, $, http) {

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
		}
	};
	
	showPage("login");
	
	$("#loginForm").on("submit", function(event) {
		/* stop form from submitting normally */
		event.preventDefault();
		
		var data = {
			user: $("#inputUser").val(),
			password: $("#inputPassword").val()
		};
		
		// to be removed: JSON.stringify and fakelogin
		http.post("/api/fakelogin/", JSON.stringify(data)).then(function(response) {
				if(!response) alert("Didn't return anything!");
				else {
					if(response.login == "OK") {
						http.auth.set(data.user, data.password);
						showPage("observacio");
					} else {
						alert("Wrong user/password");
					}
				}
			}, function(error){
				alert("There was an error " + error.code + ": " + error.error);
		});
		
	});

	$("#observacioForm").on("submit", function(event) {
		/* stop form from submitting normally */
		event.preventDefault();
		http.auth.set("prova", "prova");

		//we build the post data manually to set our geojson structure
		var data = new FormData();
		var fileInput = $("#photoId");
		data.append("file", fileInput[0].files[0]);
		data.append("geojson", JSON.stringify(asGeoJSON($(this).serializeArray())));

		http.post("api/observacions", data, false).then(function(response) {
				if(!response) alert("Didn't return anything!");
				else alert("Worked!");
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
    var map = L.map('map').setView([41.425, 2.221], 14);
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
	
	//species list attacking to MCNB (provisional)
	var classList = $('select#animalClassId');
	var specieList = $('select#specieId');
	classList.change(function () {
		var query = "SELECT DISTINCT scientificname FROM mcnb_dev  where class='" + $(this).val() +"' order by scientificname";
		$.getJSON("http://mcnb.cartodb.com/api/v2/sql",{q: query, ajax: 'true'}, function(j){
	      var options = '';
	      for (var i = 0; i < j.rows.length; i++) {
	        options += '<option value="' + j.rows[i].scientificname + '">' + j.rows[i].scientificname + '</option>';
	      }
	      specieList.html(options);
	    })
	});
	
});