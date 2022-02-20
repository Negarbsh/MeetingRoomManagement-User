const User = require("../../model/user");
const access_manager = require("./access_manager")
const Action = require("./actions")
const Response = require("../../model/response")

const success_status = 200
const access_denied_status = 403
const invalid_request_status = 406
const bad_request_status = 400


function sign_up_admin(signup_data) {
    const response_obj = Response.get_empty_response()

    if (!User.can_have_admin()) {
        response_obj.edit(invalid_request_status, false, 'An admin already exists!')
    } else {
        if (User.can_create_user(signup_data.email, signup_data.password)) {
            new User(signup_data.email, signup_data.password, signup_data.phone_number, signup_data.full_name,
                signup_data.department, signup_data.team, signup_data.organization, signup_data.office, signup_data.working_hours, 'admin', true, true)
            response_obj.edit(success_status, true, 'Admin user is created successfully!')
        } else {
            response_obj.edit(invalid_request_status, false, 'Sign up is invalid!')
        }
    }
    return response_obj
}

function sign_up_employee(signup_data) {
    const actor = access_manager.authenticate_actor(signup_data.token)

    const response_obj = Response.get_empty_response()

    if (access_manager.has_access(actor, Action.create_employee)) {
        if (User.can_create_user(signup_data.email, signup_data.password)) {
            new User(signup_data.email, signup_data.password, signup_data.phone_number, signup_data.full_name,
                signup_data.department, signup_data.team, signup_data.organization, signup_data.office, signup_data.working_hours, signup_data.role, signup_data.is_active, false)
            response_obj.edit(success_status, true, 'Employee is created successfully!')
        } else {
            response_obj.edit(invalid_request_status, false, 'Sign up is invalid. Either password is weak or the email is repeated')
        }
    } else {
        response_obj.edit(access_denied_status, false, 'access denied')
    }
    return response_obj
}

function login(data) {
    const response_obj = Response.get_empty_response()

    let given_email = data.email
    const given_pass = data.password
    if (!(given_email && given_pass)) {
        response_obj.edit(bad_request_status, false, 'Email and password are required!')
    } else {
        given_email = given_email.toLowerCase()
        const user = User.get_user_by_email(given_email)

        if (!user || !(user.is_password_correct(given_pass))) {
            response_obj.edit(invalid_request_status, false, 'Email or password is not correct!')
        } else if (user.is_logged_in) {
            response_obj.edit(invalid_request_status, false, 'User is already logged in!')
        } else {
            const token = access_manager.create_access_token(given_email, user.id)
            User.login_user(user, token)

            response_obj.edit(success_status, true, 'login successful!', token)
        }
    }
    return response_obj
}

function logout(data) {
    const actor = access_manager.authenticate_actor(data.token)
    const response_obj = Response.get_empty_response()

    if (access_manager.has_access(actor, Action.logout)) {
        const logout_status = User.logout_user(actor)
        if (logout_status === 0)
            response_obj.edit(success_status, true, 'User logged out successfully!')
        else {
            response_obj.edit(invalid_request_status, false, 'User logged is not logged in!')
        }
    } else {
        response_obj.edit(access_denied_status, false, 'Invalid access.')
    }
    return response_obj
}

function show_employee_list(data) {
    const response_obj = Response.get_empty_response()

    if (!data.token) { //means that the user wasn't logged in, we should redirect to login page
        response_obj.set_redirecting(true, '/login')
        return response_obj
    }

    const actor = access_manager.authenticate_actor(data.token)
    if (access_manager.has_access(actor, Action.show_employee_list)) {

        const employee_list = User.get_employee_list()
        response_obj.edit(success_status, true, employee_list)

    } else response_obj.edit(access_denied_status, false, 'Invalid access.')
    return response_obj
}

module.exports = {sign_up_admin, sign_up_employee, login, logout, show_employee_list}