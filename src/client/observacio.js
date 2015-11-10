$( document ).ready(function() {
    $('.datepicker').datepicker({
    	//format: 'dd/mm/yyyy',
    	language: 'ca-ES' 
    });
    
    var map = L.map('map').setView([41.43, 2.22], 14);
    var Hydda_Full = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
		attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
});