const User = require("../../model/user");
const access_manager = require("./access_manager")
const Action = require("./actions")
const Response = require("../../model/response")

const success_status = 200
const access_denied_status = 403
const unauthorized_status = 401
const invalid_request_status = 406
const bad_request_status = 400
const redirect_status = 302 //not sure if it's correct



function sign_up_admin(signup_data) {
    const response_obj = Response.get_empty_response()

    if (!User.can_have_admin()) {
        response_obj.edit(invalid_request_status, 'An admin already exists!')
    } else {
        if (User.can_create_user(signup_data.email, signup_data.password)) {
            new User(signup_data.email, signup_data.password, signup_data.phone_number, signup_data.full_name,
                signup_data.department, signup_data.organization, signup_data.office, signup_data.working_hours, 'admin', true, true)
            response_obj.edit(success_status, 'Admin user is created successfully!')
        } else {
            response_obj.edit(invalid_request_status, 'Sign up is invalid!')
        }
    }
    return response_obj
}

function sign_up_employee(signup_data) {
    const actor = access_manager.authenticate_actor(signup_data.token)

    const response_obj = Response.get_empty_response()

    if (actor && access_manager.has_access(actor, Action.create_employee)) {
        if (User.can_create_user(signup_data.email, signup_data.password)) {
            new User(signup_data.email, signup_data.password, signup_data.phone_number, signup_data.full_name,
                signup_data.department, signup_data.organization, signup_data.office, signup_data.working_hours, signup_data.role, signup_data.is_active, false)
            response_obj.edit(success_status, 'Employee is created successfully!')
        } else {
            response_obj.edit(invalid_request_status, 'Sign up is invalid. Either password is weak or the email is repeated')
        }
    } else {
        response_obj.edit(access_denied_status, 'access denied')
    }
    return response_obj
}

function login(data) {
    const response_obj = Response.get_empty_response()

    let given_email = data.email
    const given_pass = data.password
    if (!(given_email && given_pass)) {
        response_obj.edit(bad_request_status, 'Email and password are required!')
    } else {
        given_email = given_email.toLowerCase()
        const user = User.get_user_by_email(given_email)

        if (!user || !(user.is_password_correct(given_pass))) {
            response_obj.edit(invalid_request_status, 'Email or password is not correct!')
        } else if (!User.can_login(user)) {
            response_obj.edit(invalid_request_status, 'Invalid login!') //either the user is disabled or it is already logged in
        } else {
            const token = access_manager.create_access_token(given_email, user.id)
            User.login_user(user, token)

            response_obj.edit(success_status, 'login successful!', token)
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
            response_obj.edit(success_status, 'User logged out successfully!')
        else {
            response_obj.edit(invalid_request_status, 'User logged is not logged in!')
        }
    } else {
        response_obj.edit(access_denied_status, 'Invalid access.')
    }
    return response_obj
}

function show_employee_list(data) {
    const response_obj = Response.get_empty_response()

    const actor = access_manager.authenticate_actor(data.token)
    if (!actor || !actor.is_logged_in){
        response_obj.edit(redirect_status, '/login')
        return response_obj
    }
    if (access_manager.has_access(actor, Action.show_employee_list)) {
        const employee_list = User.get_employee_list()
        response_obj.edit(success_status, employee_list)

    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function view_employee(data) {
    const response_obj = Response.get_empty_response()

    const actor = access_manager.authenticate_actor(data.token)
    if (access_manager.has_access(actor, Action.view_employee)) {
        if ('employee_id' in data) {
            const user_info = User.get_attributes(data.employee_id)
            if (!user_info) response_obj.edit(bad_request_status, 'User id is wrong!')
            else response_obj.edit(success_status, user_info)
        } else response_obj.edit(bad_request_status, 'No employee id specified!')
    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function edit_employee(data) {
    const response_obj = Response.get_empty_response()
    const actor = access_manager.authenticate_actor(data.token)

    if (access_manager.has_access(actor, Action.edit_employee)) {
        if (!'employee_id' in data)
            response_obj.edit(bad_request_status, 'No "employee_id" specified!')
        else if (!'attributes' in data)
            response_obj.edit(bad_request_status, 'No "attributes" field specified!')
        else {
            const success = User.edit_administrative_attributes(data.employee_id, data.attributes)
            if (success) response_obj.edit(success_status, 'Editable attributes were edited successfully!')
            else response_obj.edit(invalid_request_status, 'User id is wrong!')
        }
    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function disable_employee(data) {
    const actor = access_manager.authenticate_actor(data.token)
    const response_obj = Response.get_empty_response()

    if (access_manager.has_access(actor, Action.disable_employee)) {
        if (!'employee_id' in data)
            response_obj.edit(bad_request_status, 'No "employee_id" specified!')
        else {
            User.disable_user(data.employee_id)
            response_obj.edit(success_status, 'Employee is disabled successfully!')
        }
    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function enable_employee(data) {
    const actor = access_manager.authenticate_actor(data.token)
    const response_obj = Response.get_empty_response()

    if (access_manager.has_access(actor, Action.enable_employee)) {
        if (!'employee_id' in data)
            response_obj.edit(bad_request_status, 'No "employee_id" specified!')
        else {
            User.enable_user(data.employee_id)
            response_obj.edit(success_status, 'Employee is enabled successfully!')
        }
    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function edit_oneself(data) {
    const actor = access_manager.authenticate_actor(data.token)
    const response_obj = Response.get_empty_response()
    if (access_manager.has_access(actor, Action.edit_oneself)) {
        if (!'attribute' in data)
            response_obj.edit(bad_request_status, 'No "attribute" field specified!')
        else if (!'new value' in data) {
            response_obj.edit(bad_request_status, 'No "new value" field specified!')
        } else {
            switch (data.attribute) {
                case "full name":
                    actor.change_name(data.new_value)
                    response_obj.edit(success_status, 'Full name is edited successfully!')
                    break
                case "working hours":
                    actor.change_working_hours(data.new_value)
                    response_obj.edit(success_status, 'Working hour is edited successfully!')
                    break
                default:
                    response_obj.edit(invalid_request_status, 'Only full name and working hours can be changed')
            }
        }
    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function search_employees(data) {
    const actor = access_manager.authenticate_actor(data.token)
    const response_obj = Response.get_empty_response()
    if (access_manager.has_access(actor, Action.search_employees)) {
        const answer = User.search(data.department_name, data.office_name)
        response_obj.edit(success_status, answer)

    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function get_working_hour(data) {
    const actor = access_manager.authenticate_actor(data.token)
    const response_obj = Response.get_empty_response()
    if (access_manager.has_access(actor, Action.get_working_hour)) {
        if (!'employee_id' in data)
            response_obj.edit(bad_request_status, 'No "employee_id" specified!')
        else {
            const answer = User.get_working_hour(data.employee_id)
            if (answer === null) response_obj.edit(bad_request_status, 'No user with this id exists!')
            else response_obj.edit(success_status, {'working_hours': answer})
        }
    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

module.exports = {
    sign_up_admin,
    sign_up_employee,
    login,
    logout,
    show_employee_list,
    view_employee,
    edit_employee,
    disable_employee,
    enable_employee,
    edit_oneself,
    search_employees,
    get_working_hour
}