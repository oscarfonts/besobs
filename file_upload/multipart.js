var express = require('express'),
    multiparty = require('multiparty'),
    shortid = require('shortid'),
    fs = require('fs'),
    conf = require('../conf/conf.json');

var router = express.Router();

router.post("*", function (req, res, next) {
	
    // parse a file upload 
    var form = new multiparty.Form();
    var maxPhotoSize = 5000000; //in bytes
    
    
    form.parse(req, function(err, fields, files) {

      if (err) {
        sendError(err);
      }
      
      var geojson;
      if(fields.hasOwnProperty('geojson') && Array.isArray(fields.geojson) && fields.geojson.length) {
      	 try {
      	 	// we use first element of the array (if many)
		    geojson = JSON.parse(fields.geojson[0]);
		 } catch(e) {
		    sendError(e);
		 }
	  }
            
      // otherwise we can use require('path')
      function getExtension(filename) {
	     var i = filename.lastIndexOf('.');
	     return (i < 0) ? '' : filename.substr(i);
	  }
	  
	  function copyFile(source, target, cb) {
		  var cbCalled = false;
		
		  var rd = fs.createReadStream(source);
		  rd.on("error", function(err) {
		    done(err);
		  });
		  var wr = fs.createWriteStream(target);
		  wr.on("error", function(err) {
		    done(err);
		  });
		  wr.on("close", function(ex) {
		    done();
		  });
		  rd.pipe(wr);
		
		  function done(err) {
		    if (!cbCalled) {
		      cb(err);
		      cbCalled = true;
		    }
		  }
	  }
	  
	  function sendError(error) {
	  	  logWarning(error);
		  res.status(500).send(error);
	  }
	  
	  function logWarning(error) {
	  	  //we won't send the error, just log
	  	  console.log(error);
	  }
	  
	  function fileError(error) {
	  	  // without a file, the app mustn't crash or stop
	  	  if(error) logWarning("Error creating file: " + error);  
	  }
      
      // manage image
      if(files.file) {
	      var file = files.file[0];
	      if(files.file[0].size > maxPhotoSize) {
	      	sendError("Maximum photo size of " + maxPhotoSize + " exceeded");
	      }
	      var filename = shortid.generate() + getExtension(file.path);
	      
      	  copyFile(file.path, conf.UPLOAD_DIR +  filename, fileError);
	      geojson.features[0].properties.image = conf.PUBLIC_URL + conf.UPLOAD_URL + filename;
	  }
	  
      req.body = JSON.stringify(geojson);
      next();
            
    });
   
});

module.exports = router;
