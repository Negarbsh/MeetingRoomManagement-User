const Action = require('../model/actions');
const user_manager = require('../data access/user manager')
const jwt = require("jsonwebtoken");


function has_access(actor_mail, action) {
    if (action === Action.sign_up_admin)
        return true
    const user = user_manager.get_user_by_email(actor_mail)
    if (!actor_mail) return false //if the user didn't exist (which happens when the token is wrong, it has no access!)
    if (!user.is_active) return false //a disabled user cannot do anything, even if they are logged in!
    switch (action) {
        case Action.create_employee || Action.view_employee || Action.edit_employee || Action.show_employee_list
        || Action.disable_employee || Action.enable_employee:
            return actor_mail === user_manager.get_admin_mail() && user.is_logged_in
        case Action.logout || Action.edit_oneself || Action.search_employees || Action.get_working_hour:
            return actor_mail.is_logged_in
        default:
            return true
    }
}


function create_access_token(email, id) {
    return jwt.sign(
        {user_id: id, email: email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
}


module.exports = {has_access, create_access_token}
