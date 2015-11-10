var express = require('express'),
    bodyParser = require('body-parser'),
    cartodb = require('cartodb'),
    secret  = require('./secret.js'),
    Promise = require('promise');

var router = express.Router();

// Parse body as json
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

var connect = function(asGeoJSON) {
    return new Promise(function(fulfill) {
        var params = {
            user: secret.USER,
            api_key: secret.API_KEY
        };

        if(asGeoJSON) {
            params["api_url"] = "https://" + secret.USER + ".cartodb.com/api/v2/sql?format=GeoJSON";
        }

        var client = new cartodb(params);

        client.on('connect', function () {
            fulfill(client);
        });

        client.connect();
    });
};

var query = function(sql, params, asGeoJSON) {
    return new Promise(function(fulfill, reject) {
        var callback = function(error, data) {
            if(error) {
                reject(error);
            } else {
                fulfill(data);
            }
        };

        var query = function(client) {
            client.query(sql, params, callback);
        };

        connect(asGeoJSON).then(query);
    })
};

var success = function(data) {
    this.send(data);
};

var error = function(error) {
    this.status(500).send(error);
};

router.get('/', function (req, res) {
    var sql = "SELECT * FROM CDB_UserTables()";

    function parse(data) {
        var tables = [];
        for(var i in data.rows) {
            var url = req.protocol + "://" + req.get('host');
            url += req.originalUrl;
            if (url[url.length-1] != "/") {
                url += "/";
            }
            url += data.rows[i]["cdb_usertables"];
            tables.push({
                name: data.rows[i]["cdb_usertables"],
                url: url
            });
        }
        res.send({tables: tables});
    }

    query(sql).then(parse, error.bind(res));
});

router.get('/:table', function (req, res) {
    var sql = "SELECT * FROM {table}";
    var params = {table: req.params.table};

    query(sql, params, true).then(success.bind(res), error.bind(res));
});

router.get('/:table/:id', function (req, res) {
    var sql = "SELECT * FROM {table} WHERE cartodb_id={id}";
    var params = {
        table: req.params.table,
        id: req.params.id
    };

    query(sql, params, true).then(success.bind(res), error.bind(res));
});

router.post('/:table', function (req, res) {
    var data = {
        user: req.user,
        table: req.params.table,
        body: "TODO" // TODO recuperar los datos del POST
    };
    console.log(data);
    // TODO insertar el registro
    // TODO devolver el nuevo registro, junto con el ID (!)
    res.send(data);
});

router.put('/:table/:id', function (req, res) {
    var data = {
        user: req.user,
        table: req.params.table,
        id: req.params.id,
        body: "TODO" // TODO recuperar los datos del PUT
    };
    console.log(data);
    // TODO comprobar que el registro realmente existe
    // TODO modificar el registro
    // TODO devolver el nuevo registro
    res.send(data);
});

router.delete('/:table/:id', function (req, res) {
    // TODO comprobar que no existe el registro
    var data = {
        user: req.user,
        table: req.params.table,
        id: req.params.id
    };
    console.log(data);
    // TODO comprobar que el registro realmente existe
    // TODO borrar el registro
    // TODO devolver el ID del registro recién borrado
    res.send(data);
});

module.exports = router;
