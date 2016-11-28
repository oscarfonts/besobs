var config = require("../config"),
    users = require("./users");

if(process.argv.length != 5) {
    console.log("Usage:");
    console.log("   node create_user.js <username> <password> [<isAdmin>]");
    console.log("Example:");
    console.log("   node create_user.js john secret true");
} else {
    var name = process.argv[2],
        password = process.argv[3],
        isAdmin = (process.argv[4].toLowerCase() === "true");

    users.create(name, password, isAdmin, function(id) {
        console.log("User '" + name + "' created successfully with id = " + id);
    }, function(err) {
        console.error(err);
    });
}
