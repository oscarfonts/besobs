define(['jquery', 'http', 'bootstrap'], function($, http) {

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
        $('#newIsAdmin').prop('checked', false);
        $("#newPanel").show();
    };

    var showExistingUser = function(data) {
        $("#newPanel").hide();
        $("#editId").val(data.id);
        $("#editName").val(data.name);
        $("#editPassword").val("");
        $('#editIsAdmin').prop('checked', data.isAdmin);
        $("#editPanel").show();
    };

    // Data Access Methods
    var listUsers = function() {
        http.get("users").then(showUserList, showError);
    };

    var createUser = function(name, password, isAdmin) {
        http.post("users", {
            name: name,
            password: password,
            isAdmin: isAdmin
        }).then(listUsers, showError); // TODO show some status info
    };

    var getUser = function(id) {
        http.get("users/"+id).then(showExistingUser, showError);
    };

    var updateUser = function(id, name, password, isAdmin) {
        http.put("users/"+id, {
            name: name,
            password: password,
            isAdmin: isAdmin
        }).then(listUsers, showError); // TODO show some status info
    };

    var deleteUser = function(id) {
        http.del("users/"+id).then(listUsers, showError); // TODO show some status info
    };

    // Click handlers
    $("#new").click(showNewUserForm);

    $("#createUser").click(function() {
        var mandatoryFields = ["newName", "newPassword"];
		var checked = checkMandatory(mandatoryFields, true);
        if(checked.indexOf(false) != -1) return false;
        createUser($("#newName").val(), $("#newPassword").val(), $('#newIsAdmin').prop('checked'));
    });

    $("#updateUser").click(function() {
        var mandatoryFields = ["editName", "editPassword"];
		var checked = checkMandatory(mandatoryFields, true);
        if(checked.indexOf(false) != -1) return false;
        updateUser($("#editId").val(), $("#editName").val(), $("#editPassword").val(), $('#editIsAdmin').prop('checked'));
    });

    $("#deleteUser").click(function() {
        deleteUser($("#editId").val());
    });

    $("#logoutLink").click(function() {
        http.auth.clear();
        http.get("../api/logout/").then(function() {
            location = "../";
        },function() {
            location = "../";
        });
    });

    var checkMandatory = function(fields, scroll) {
		var result = [];
		for (var i = 0; i < fields.length; i ++) {
			var field = $("#" + fields[i]);
			if(!field.val()) {
				field.parent().addClass("has-error");
				//if first result, scroll there
				if(scroll && result.indexOf(false) == -1) {
					$('html, body').animate({
				        scrollTop: field.offset().top
				    }, 1000);
				}
				result[i] = false;
			} else {
				field.parent().removeClass("has-error");
				result[i] = true;
			}
		}
		return result;
	};

    // Initialization
    http.cache.disable();
    listUsers();
});
