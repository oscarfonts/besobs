var express = require('express'),
    bodyParser = require('body-parser'),
    cartodb_api = require('./cartodb/api');

var app = express();

// Parse body as json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Add cartodb api
app.use('/api', cartodb_api);

// Page not found
app.use(function (req, res) {
    res.status(404).send({
        code: 404,
        message: 'Page not found'
    });
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
