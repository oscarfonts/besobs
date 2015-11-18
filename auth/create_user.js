var users = require("./users");

if(process.argv.length != 4) {
    console.log("Usage:");
    console.log("   node create_user.js <username> <password>");
} else {
    var name = process.argv[2],
        password = process.argv[3];

    users.insert(name, password);

    console.log("User '" + name + "' created successfully.");
}
