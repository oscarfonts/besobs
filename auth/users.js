var crypto = require('crypto'),
    sqlite3 = require('sqlite3'),
    path = require('path');

var db = new sqlite3.Database(path.join(__dirname, 'users.db'));

var hash = function(password) {
    var salt = 'kd8c2YYSuEjQsEWc8KQFCGHx';
    return crypto.pbkdf2Sync(password, salt, 4096, 64, 'sha256').toString('hex');
};

var users = {
    insert: function(username, password) {
        db.run("CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT)", function() {
            db.run("INSERT INTO user(name, password) VALUES ($name, $password)", {
                $name: username,
                $password: hash(password)
            });
        });
    },
    check: function(username, password, callback) {
        db.get("SELECT name FROM user WHERE name = $name AND password = $password", {
            $name: username,
            $password: hash(password)
        }, function(err, row) {
            if (row) {
                callback(row.name);
            } else {
                callback(false);
            }
        });
    }
};

module.exports = users;
