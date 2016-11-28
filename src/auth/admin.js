var express = require('express'),
    bodyParser = require('body-parser'),
    users = require('./users');

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// Filter admins
router.use(function(req, res, next) {
    if(!req.user.isAdmin) {
        return res.status(401).end();
    } else {
        next();
    }
});

// List
router.get('/users', function (req, res) {
    users.list(function(userList) {
        res.send(userList);
    }, function(error) {
        res.status(500).send(error);
    });
});

// Create
router.post('/users', function (req, res) {
    users.create(req.body.name, req.body.password, req.body.isAdmin, function(newId) {
        res.send({id: newId});
    }, function(error) {
        res.status(500).send(error);
    });
});

// Retrieve
router.get('/users/:id', function (req, res) {
    users.retrieve(req.params.id, function(userDetails) {
        res.send(userDetails);
    }, function(error) {
        res.status(500).send(error);
    });
});

// Update
router.put('/users/:id', function (req, res) {
    users.update(req.params.id, req.body.name, req.body.password, req.body.isAdmin, function(itemsUpdated) {
        res.json({"updated": itemsUpdated});
    }, function(error) {
        res.status(500).send(error);
    });
});

// Delete
router.delete('/users/:id', function (req, res) {
    users.delete(req.params.id, function(itemsDeleted) {
        res.json({"deleted": itemsDeleted});
    }, function(error) {
        res.status(500).send(error);
    });
});

module.exports = router;
