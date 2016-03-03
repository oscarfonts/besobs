define(['jquery', 'http', 'bootstrap'], function($, http) {

    http.cache.disable();

    var showError = function(error) {
        console.error(error);
        alert("Hi ha hagut un error");
    };

    var showUserList = function(users) {
        $("#newPanel").hide();
        $("#editPanel").hide();
        var list = $("#userlist").empty();
        for(var i in users) {
            var user = users[i];
            var item = $('<a/>').attr("id", "user_" + user.id).attr("href", "#").addClass("list-group-item");
            item.text(user.name);
            item.click(function() {
                $(".list-group-item").removeClass("active");
                var id = $(this).addClass("active").attr("id").split("_")[1];
                getUser(id);
            });
            item.appendTo(list);
        }
    };

    var showNewUserForm = function() {
        $(".list-group-item").removeClass("active");
        $("#editPanel").hide();
        $("#newName").val("");
        $("#newPassword").val("");
        $("#newPanel").show();
    };

    var showExistingUser = function(data) {
        $("#newPanel").hide();
        $("#editId").val(data.id);
        $("#editName").val(data.name);
        $("#editPassword").val("");
        $("#editPanel").show();
    };

    // Data Access Methods
    var listUsers = function() {
        http.get("users").then(showUserList, showError);
    };

    var createUser = function(name, password) {
        http.post("users", {
            name: name,
            password: password
        }).then(listUsers, showError); // TODO show some status info
    };

    var getUser = function(id) {
        http.get("users/"+id).then(showExistingUser, showError);
    };

    var updateUser = function(id, name, password) {
        http.put("users/"+id, {
            name: name,
            password: password
        }).then(listUsers, showError); // TODO show some status info
    };

    var deleteUser = function(id) {
        http.del("users/"+id).then(listUsers, showError); // TODO show some status info
    };

    // Click handlers
    $("#new").click(showNewUserForm);

    $("#createUser").click(function() {
        createUser($("#newName").val(), $("#newPassword").val());
    });

    $("#updateUser").click(function() {
        updateUser($("#editId").val(), $("#editName").val(), $("#editPassword").val());
    });

    $("#deleteUser").click(function() {
        deleteUser($("#editId").val());
    });

    listUsers();
});
