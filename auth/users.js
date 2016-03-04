var crypto = require('crypto'),
    sqlite3 = require('sqlite3'),
    path = require('path'),
    config = require('../config');

var db = new sqlite3.Database(path.join(config.data_dir, "users.db"));
console.log("Data dir is " + config.data_dir);

var hash = function(password) {
    var salt = 'kd8c2YYSuEjQsEWc8KQFCGHx';
    return crypto.pbkdf2Sync(password, salt, 4096, 64, 'sha256').toString('hex');
};

var users = {
    list: function(onSuccess, onError) {
        db.all("SELECT id, name, isAdmin FROM user", function(err, rows) {
            if(!err && onSuccess) {
                rows = rows.map(function(row) {
                    row.isAdmin = (row.isAdmin == 1);
                    return row;
                });
                onSuccess(rows);
            } else if(err && onError) {
                onError(err);
            }
        });
    },
    create: function(username, password, isAdmin, onSuccess, onError) {
        db.run("CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, isAdmin BOOLEAN)", function() {
            db.run("INSERT INTO user(name, password, isAdmin) VALUES ($name, $password, $isAdmin)", {
                $name: username,
                $password: hash(password),
                $isAdmin: isAdmin
            }, function(err) {
                if(!err && onSuccess) {
                    onSuccess(this.lastID);
                } else if(err && onError) {
                    onError(err);
                }
            });
        });
    },
    retrieve: function(id, onSuccess, onError) {
        db.get("SELECT id, name, isAdmin FROM user WHERE id = $id", {
            $id: id
        }, function(err, row) {
            if(!err && onSuccess) {
                row.isAdmin = (row.isAdmin == 1);
                onSuccess(row);
            } else if(err && onError) {
                onError(err);
            }
        });
    },
    update: function(id, username, password, isAdmin, onSuccess, onError) {
        db.run("UPDATE user SET name = $name, password = $password, isAdmin = $isAdmin WHERE id = $id", {
            $id: id,
            $name: username,
            $password: hash(password),
            $isAdmin: isAdmin
        }, function(err) {
            if(!err && onSuccess) {
                onSuccess(this.changes);
            } else if(err && onError) {
                onError(err);
            }
        });
    },
    delete: function(id, onSuccess, onError) {
        db.run("DELETE FROM user WHERE id = $id", {
            $id: id
        }, function(err) {
            if(!err && onSuccess) {
                onSuccess(this.changes);
            } else if(err && onError) {
                onError(err);
            }
        });
    },
    check: function(username, password, callback) {
        db.get("SELECT id, name, isAdmin FROM user WHERE name = $name AND password = $password", {
            $name: username,
            $password: hash(password)
        }, function(err, row) {
            if (row) {
                row.isAdmin = (row.isAdmin == 1);
                callback(row);
            } else {
                callback(false);
            }
        });
    }
};

module.exports = users;
