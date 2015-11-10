//we will organise it better, I promise
$( document ).ready(function() {
	
    //datepicker stuff
    $('.datepicker').datepicker({
    	//format: 'dd/mm/yyyy',
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
		marker.setLatLng(new L.LatLng(yBox.val(), xBox.val()));
	}
});