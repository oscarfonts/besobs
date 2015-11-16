var express = require('express'),
    bodyParser = require('body-parser'),
    cartodb = require('cartodb'),
    secret = require('./secret.js'),
    Promise = require('promise');

var router = express.Router();

// Parse body as json
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));


var escape1 = function (string) {
    return "'" + string.replace("'", "''") + "'";
};

var escape2 = function (string) {
    return '"' + string.replace('"', '""') + '"';
};

var getUrl = function (req) {
    var url = req.protocol + "://" + req.get('host');
    url += req.originalUrl;
    if (url[url.length - 1] != "/") {
        url += "/";
    }
    return url;
};

var connect = function (asGeoJSON) {
    return new Promise(function (fulfill) {
        var params = {
            user: secret.USER,
            api_key: secret.API_KEY
        };

        if (asGeoJSON) {
            params["api_url"] = "https://" + secret.USER + ".cartodb.com/api/v2/sql?format=GeoJSON";
        }

        var client = new cartodb(params);

        client.on('connect', function () {
            fulfill(client);
        });

        client.connect();
    });
};

var query = function (sql, params, asGeoJSON) {
    return new Promise(function (fulfill, reject) {
        var callback = function (error, data) {
            if (error) {
                reject(error);
            } else {
                fulfill(data);
            }
        };

        var query = function (client) {
            client.query(sql, params, callback);
        };

        connect(asGeoJSON).then(query);
    })
};

var success = function (data) {
    this.send(data);
};

var error = function (error) {
    this.status(500).send(error);
};

router.get('/', function (req, res) {
    var sql = "SELECT * FROM CDB_UserTables()";

    function parse(data) {
        var tables = [];
        for (var i in data.rows) {
            var table = data.rows[i]["cdb_usertables"];
            tables.push({
                name: table,
                url: getUrl(req) + table
            });
        }
        res.send({tables: tables});
    }

    query(sql).then(parse, error.bind(res));
});

router.get('/:table', function (req, res) {
    // TODO Filtrar por req.user

    var sql = "SELECT * FROM {table}";
    var params = {table: escape2(req.params.table)};

    query(sql, params, true).then(success.bind(res), error.bind(res));
});

router.get('/:table/:id', function (req, res) {
    // TODO Filtrar por req.user

    var sql = "SELECT * FROM {table} WHERE cartodb_id={id}";
    var params = {
        table: escape2(req.params.table),
        id: escape1(req.params.id)
    };

    query(sql, params, true).then(success.bind(res), error.bind(res));
});

router.post('/:table', function (req, res) {
    // TODO Insertar req.user

    var table = escape2(req.params.table);
    var keys = [];
    var values = [];
    for (var key in req.body) {
        keys.push(escape2(key));
        values.push(escape1(req.body[key]));
    }

    var sql = "INSERT INTO " + table + " (" + keys.join(", ") + ") VALUES (" + values.join(", ") + ") RETURNING cartodb_id";

    var parse = function (data) {
        var response = data.rows[0];
        response.url = getUrl(req) + data.rows[0]["cartodb_id"];
        res.send(response);
    };

    query(sql, null, false).then(parse, error.bind(res));
});

router.put('/:table/:id', function (req, res) {
    // TODO Filtrar por -e insertar- req.user

    var table = escape2(req.params.table);
    var id = escape1(req.params.id);
    var keys = [];
    var values = [];
    req.body.cartodb_id = req.params.id;
    for (var key in req.body) {
        keys.push(escape2(key));
        values.push(escape1(req.body[key]));
    }

    var sql = "UPDATE " + table + " SET (" + keys.join(", ") + ") = (" + values.join(", ") + ") WHERE cartodb_id = " + id + " RETURNING cartodb_id";

    var parse = function (data) {
        var response = data.rows[0];
        response.url = getUrl(req);
        res.send(response);
    };

    query(sql, null, false).then(parse, error.bind(res));
});

router.delete('/:table/:id', function (req, res) {
    // TODO Filtrar por req.user

    var table = escape2(req.params.table);
    var id = escape1(req.params.id);

    var sql = "DELETE FROM " + table + " WHERE cartodb_id = " + id + " RETURNING cartodb_id";

    var parse = function (data) {
        if (data.rows.length) {
            var response = data.rows[0];
            res.send(response);
        } else {
            res.send({message: "No rows affected"});
        }
    };

    query(sql, null, false).then(parse, error.bind(res));
});

module.exports = router;
