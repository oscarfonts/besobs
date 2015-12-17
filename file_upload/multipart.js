var express = require('express'),
    multiparty = require('multiparty'),
    shortid = require('shortid'),
    fs = require('fs'),
    conf = require('./conf.js');

var router = express.Router();

router.post("*", function (req, res, next) {
	
    // parse a file upload 
    var form = new multiparty.Form();
    
    
    form.parse(req, function(err, fields, files) {

      if (err) {
        console.log(err);
        next(); // go to the next function to see if the request is not a multipart
      }
      var geojson = JSON.parse(fields.geojson[0]);
            
      // otherwise we can use require('path')
      function getExtension(filename) {
	     var i = filename.lastIndexOf('.');
	     return (i < 0) ? '' : filename.substr(i);
	  }
      
      // manage image
      if(files.file) {
	      var file = files.file[0];
	      // with files.file[0].size we could limit size  
	      var filename = shortid.generate() + getExtension(file.path);
	      fs.createReadStream(file.path).pipe(fs.createWriteStream(conf.UPLOAD_DIR +  filename));
	      geojson.features[0].properties.image = conf.PUBLIC_URL + conf.UPLOAD_URL + filename;
	  }
      req.body = JSON.stringify(geojson);
      
      next();
            
    });
   
});

module.exports = router;
