// requirements
var cartodb = require('cartodb'),
    express = require('express'),
    secret = require('./secret.js'),
    passport = require('passport');

// initialize express
var app = express();


// TODO show all possible tables
//client.query("SELECT * FROM CDB_UserTables()", outputRows);

// a friendly little route
app.get('/api/:table', function (req, res) {

    var table = req.params.table;

    // connect to cartodb
    var client = new cartodb({
        user: secret.USER,
        api_key: secret.API_KEY,
        api_url: "https://" + secret.USER + ".cartodb.com/api/v2/sql?format=GeoJSON"
    });

    var outputRows = function (err, data) {
        if(err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            console.log(data/*.rows*/);
            res.send(data/*.rows*/);
        }
    };

    // build your query
    client.on('connect', function () {
        client.query("select * from {table} limit 5", {table: table}, outputRows);
    });

    client.connect();

});

// start listening
app.listen(3333);
console.log('Up&running');
