const User = require("../../model/user");
Action = require('./actions')

function has_access(user, action) {
    if(!user) return false //if the user didn't exist (which happens when the token is wrong, it has no access!)
    switch (action) {
        case Action.sign_up_admin:
            return true
        case Action.create_employee:
            return user === User.admin
        case Action.logout:
            return true
        default:
            return true //todo complete
    }
}

module.exports = {has_access}