var express = require('express'),
    multiparty = require('multiparty'),
    shortid = require('shortid'),
    fs = require('fs');

var router = express.Router();

router.post("*", function (req, res, next) {
	
    // parse a file upload 
    var form = new multiparty.Form();
    
    
    form.parse(req, function(err, fields, files) {

      if (err) {
        //TODO: error management
        console.log(err);
      }
      var geojson = JSON.parse(fields.geojson[0]);
            
      // otherwise we can use require('path')
      function getExtension(filename) {
	     var i = filename.lastIndexOf('.');
	     return (i < 0) ? '' : filename.substr(i);
	  }
      
      // manage image
      // TODO: error management
      var file = files.file[0];
      // with files.file[0].size we could limit size  
      var filename = shortid.generate() + getExtension(file.path);
      fs.createReadStream(file.path).pipe(fs.createWriteStream('file_upload/uploads/' +  filename));
            
      geojson.features[0].properties.image = "http://localhost:2015/images/" + filename;
      req.body = JSON.stringify(geojson);
      
      next();
            
    });
   

});

module.exports = router;
