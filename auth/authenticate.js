var express = require('express'),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy;

var realm = "API";

passport.use(new BasicStrategy({
        realm: realm
    }, function (user, password, done) {
        if (user == "user" && password == "password") {
            return done(null, user);
        } else {
            return done(null, false);
        }
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
