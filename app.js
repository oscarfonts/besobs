var express = require('express'),
    cors = require('./cors/cors'),
    authenticate = require('./auth/authenticate'),
    cartodb_api = require('./cartodb/api'),
    file_upload = require('./file_upload/multipart');

var app = express();

// Add cross-origin headers
app.use('/api', cors);

// Add authentication to API
app.use('/api', authenticate);

// Manage file upload (multipart data)
app.use('/api', file_upload);
//the uploaded files have to be public
app.use('/images', express.static('file_upload/uploads'));

// Expose cartodb as API
app.use('/api', cartodb_api);

// Static contents
app.use(express.static('static'));

// Page not found handler
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
