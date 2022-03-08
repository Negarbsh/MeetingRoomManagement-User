const Action = require('../models/enums/actions');
const user_manager = require('../data_access/user_manager')
const jwt = require("jsonwebtoken");


async function has_access(actor_mail, action) {
    if (action === Action.sign_up_admin)
        return true
    const user = await user_manager.get_user_by_email(actor_mail)
    if (!actor_mail || !user) return false //if the user didn't exist (which happens when the token is wrong, it has no access!)
    if (!user.is_active) return false //a disabled user cannot do anything, even if they are logged in!
    switch (action) {
        case Action.create_employee || Action.view_employee || Action.edit_employee || Action.show_employee_list
        || Action.logout || Action.disable_employee || Action.enable_employee:
            return actor_mail === user_manager.get_admin_mail() && user.is_logged_in
        case Action.edit_oneself || Action.search_employees || Action.get_working_hour:
            return user.is_logged_in
        default:
            return true
    }
}


function create_access_token(email, id, is_admin) {
    return jwt.sign(
        {user_id: id, email: email, is_admin: is_admin},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
}


module.exports = {has_access, create_access_token}
