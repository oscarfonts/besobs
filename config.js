var path = require('path');

var data_dir = path.resolve(process.argv.length == 3 ? process.argv[2] : "DATA_DIR");

var config = require(path.resolve(data_dir, "config.json"));
config.data_dir = data_dir;

config.get_url = function(req) {
    var url = config.base_url.replace(/\/$/, "") + req.originalUrl;
    return url.replace(/\/?$/, '/'); // Add trailing slash if needed;
};

module.exports = config;
