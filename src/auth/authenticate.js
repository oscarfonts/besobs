var express = require('express'),
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    users = require('./users');

var realm = "API";

passport.use(new BasicStrategy({
        realm: realm
    }, function (login, password, done) {
        users.check(login, password, function(user) {
            return done(null, user);
        });
    })
);

var authenticate = function(req, res, next) {
    passport.authenticate('basic', { session: false }, function(err, user) {
        if (!err && !user) {
            // Invalid credentials - trigger the login dialog
            var challenge = 'Basic realm=' + realm;
            if(req.get('x-requested-with') == 'XMLHttpRequest') {
                // Except in case of AJAX calls, where we don't want browsers show their bundled login dialog
                challenge = 'x' + challenge;
            }
            res.set('WWW-Authenticate', challenge);
            return res.status(401).end();
        } else {
        	req.user = user;
            return next(err);
        }
    })(req, res, next);
};

var router = express.Router();

//login doesn't require user/pwd headers
router.get('*', authenticate);
router.post('*', authenticate);
router.put('*', authenticate);
router.delete('*', authenticate);

router.get('/logout', function (req, res) {
    var challenge = 'Basic realm=' + realm;
    if(req.get('x-requested-with') == 'XMLHttpRequest') {
        // Except in case of AJAX calls, where we don't want browsers show their bundled login dialog
        challenge = 'x' + challenge;
    }
    res.set('WWW-Authenticate', challenge);
    return res.status(401).end();
});

router.post('/login', function (req, res) {
	console.log(req.user.name + " logged in");
	// we don't need to recheck user and pwd, as passport already did: if you're here, you're logged in 
	/*users.check(req.user, req.password, function(result) {
		if(result !== false) res.send({login: 'OK'}); 
		else res.send({login: 'KO'});
	}};*/
	res.send({login: 'OK', user: req.user});
});

module.exports = router;
