// requirements
var app = require('./app');

// start listening
var server = app.listen(process.env.PORT || 2015, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
