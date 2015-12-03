var express = require('express'),
    Promise = require('promise'),
    multiparty = require('multiparty');

var router = express.Router();



router.post("*", function (req, res, next) {
    // parse a file upload 
    var form = new multiparty.Form();
    
    form.parse(req, function(err, fields, files) {
      if (err) {
        //TODO: error management
        console.log(err);
      }
      //console.log(req.body);
      req.body = JSON.stringify(fields.geojson[0]);
      
      //TODO: manage image
      //if(files.file[0]) console.log("You may find an image at " + files.file[0].path);
      
      next();
      
    });

});

module.exports = router;
