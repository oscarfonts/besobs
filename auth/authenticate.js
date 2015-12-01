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

//login doesn't require user/pwd headers
router.get('*', passport.authenticate('basic', {session: false}));
router.post('*', passport.authenticate('basic', {session: false}));
router.put('*', passport.authenticate('basic', {session: false}));
router.delete('*', passport.authenticate('basic', {session: false}));

router.get('/logout', function (req, res) {
    res.set('WWW-Authenticate', 'Basic realm=' + realm);
    return res.sendStatus(401);
});

router.post('/login', function (req, res) {
	console.log(req.user + " logged in");
	// we don't need to recheck user and pwd, as passport already did: if you're here, you're logged in 
	/*users.check(req.user, req.password, function(result) {
		if(result !== false) res.send({login: 'OK'}); 
		else res.send({login: 'KO'});
	}};*/
	res.send({login: 'OK'});
});

module.exports = router;
