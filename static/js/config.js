var require = (function() {
	var scripts = document.getElementsByTagName('script');
	var HERE = scripts[scripts.length-1].src.replace(/[^\/]*$/, '');
	var LIB_PATH = HERE + "bower_components/";
	return {
		baseUrl: HERE + "modules/",
		paths: {
			"jquery": LIB_PATH + "jquery/dist/jquery.min",
			"bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min",
            "bootstrap-datepicker": LIB_PATH + "bootstrap-datepicker/dist/js/bootstrap-datepicker.min",
            "bootstrap-datepicker-ca": LIB_PATH + "bootstrap-datepicker/js/locales/bootstrap-datepicker.ca",
			"leaflet": LIB_PATH + "leaflet/dist/leaflet",
            "css": LIB_PATH + "require-css/css"
		},
		shim: {
			"bootstrap": {
				deps: ["jquery", "css!//maxcdn.bootstrapcdn.com/bootswatch/3.3.5/united/bootstrap.min.css"]
			},
            "bootstrap-datepicker": {
				deps: ["bootstrap", "css!" + LIB_PATH + "bootstrap-datepicker/dist/css/bootstrap-datepicker.css"]
			},
            "bootstrap-datepicker-ca": {
				deps: ["bootstrap-datepicker"]
			},
			"leaflet": {
				deps: ["css!" + LIB_PATH + "leaflet/dist/leaflet.css"]
			}
            
		}
	};
})();

