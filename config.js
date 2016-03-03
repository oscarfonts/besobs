var path = require('path');

var data_dir = path.resolve(process.argv.length > 2 ? process.argv[2] : "DATA_DIR");

var get_url = function(req) {
    var url = host(req) + req.originalUrl;
        if (url[url.length - 1] != "/") {
            url += "/";
        }
    return url;
};

var host = function(req) {
    var host = req.get("X-Forwarded-Host") ? req.get("X-Forwarded-Host") : req.get("host");
    return req.protocol + "://" + host;
}

module.exports = {
    data_dir: data_dir,
    cartodb: require(path.resolve(data_dir, "cartodb.json")),
    get_url: get_url,
    host: host
};
