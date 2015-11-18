var express = require('express'),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    users = require('./users');

var realm = "API";

passport.use(new BasicStrategy({
        realm: realm
    }, function (user, password, done) {
        users.check(user, password, function(name) {
            return done(null, name);
        });
    })
);

var router = express.Router();

router.get('*', passport.authenticate('basic', {session: false}));
router.post('*', passport.authenticate('basic', {session: false}));
router.put('*', passport.authenticate('basic', {session: false}));
router.delete('*', passport.authenticate('basic', {session: false}));

router.get('/logout', function (req, res) {
    res.set('WWW-Authenticate', 'Basic realm=' + realm);
    return res.sendStatus(401);
});

module.exports = router;
