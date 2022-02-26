const access_manager = require("./access_manager")
const Action = require("../model/actions")
const Response = require("../model/response")
const user_manager = require("../data access/user manager")

//todo status codes can be enum
const success_status = 200
const access_denied_status = 403
const unauthorized_status = 401
const invalid_request_status = 406
const bad_request_status = 400
const redirect_status = 302 //not sure if it's correct


function sign_up_admin(email, password, phone_number, full_name, department, organization_level, office, working_hours) {
    const response_obj = Response.get_empty_response()

    if (user_manager.has_admin()) {
        response_obj.edit(invalid_request_status, 'An admin already exists!')
    } else {
        if (user_manager.can_create_user(email, password)) {
            user_manager.create_admin(email, password, phone_number, full_name, department, organization_level, office, working_hours)
            response_obj.edit(success_status, 'Admin user is created successfully!')
        } else response_obj.edit(invalid_request_status, 'Sign up is invalid!')
    }
    return response_obj
}

async function sign_up_employee(actor_mail, email, password, phone_number, full_name, department, organization_level, office, working_hours, role) {
    const response_obj = Response.get_empty_response()

    if (access_manager.has_access(actor_mail, Action.create_employee)) {
        if (user_manager.can_create_user(email, password)) {
            user_manager.create_employee(email, password, phone_number, full_name, department, organization_level, office, working_hours, role)
            response_obj.edit(success_status, 'Employee is created successfully!')
        } else {
            response_obj.edit(invalid_request_status, 'Sign up is invalid. Either password is weak or the email is repeated')
        }
    } else {
        response_obj.edit(access_denied_status, 'Access denied')
    }
    return response_obj
}

async function login(given_email, given_password) {
    const response_obj = Response.get_empty_response()

    given_email = given_email.toLowerCase()
    const user = user_manager.get_user_by_email(given_email)

    if (!user || !(await user.is_password_correct(given_password))) {
        response_obj.edit(invalid_request_status, 'Email or password is not correct!')
    } else if (!user_manager.can_login(user)) {
        response_obj.edit(invalid_request_status, 'Invalid login!')
    } else {
        const token = await access_manager.create_access_token(given_email, user.id)
        user_manager.login_user(user, token)
        response_obj.edit(success_status, 'login successful!', token)
    }
    return response_obj
}

function logout(actor_mail) {
    const response_obj = Response.get_empty_response()

    if (access_manager.has_access(actor_mail, Action.logout)) {
        const logout_status = user_manager.logout_user(actor_mail)
        if (logout_status === 0)
            response_obj.edit(success_status, 'User logged out successfully!')
        else {
            response_obj.edit(invalid_request_status, 'User is not logged in!')
        }
    } else {
        response_obj.edit(access_denied_status, 'Invalid access.')
    }
    return response_obj
}

function show_employee_list(actor_mail) {
    const response_obj = Response.get_empty_response()
    const actor = user_manager.get_user_by_email(actor_mail)
    if (!actor || !actor.is_logged_in) {
        response_obj.edit(redirect_status, '/login')
        return response_obj
    }
    if (access_manager.has_access(actor_mail, Action.show_employee_list)) {
        const employee_list = user_manager.get_employee_list()
        response_obj.edit(success_status, employee_list)

    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function view_employee(actor_mail, employee_id) {
    const response_obj = Response.get_empty_response()
    if (access_manager.has_access(actor_mail, Action.view_employee)) {
        const user_info = user_manager.get_attributes(employee_id)
        if (!user_info) response_obj.edit(bad_request_status, 'User id is wrong!')
        else response_obj.edit(success_status, user_info)
    } else
        response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function edit_employee(actor_mail, employee_id, new_attributes) {
    const response_obj = Response.get_empty_response()

    if (access_manager.has_access(actor_mail, Action.edit_employee)) {
        const success = user_manager.edit_administrative_attributes(employee_id, new_attributes)
        if (success) response_obj.edit(success_status, 'Editable attributes were edited successfully!')
        else response_obj.edit(invalid_request_status, 'User id is wrong!')

    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function disable_employee(actor_mail, data) {
    const response_obj = Response.get_empty_response()
    if (access_manager.has_access(actor_mail, Action.disable_employee)) {
        user_manager.disable_user(data.employee_id)
        response_obj.edit(success_status, 'Employee is disabled successfully!')
    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function enable_employee(actor_mail, data) {
    const response_obj = Response.get_empty_response()
    if (access_manager.has_access(actor_mail, Action.enable_employee)) {
        user_manager.enable_user(data.employee_id)
        response_obj.edit(success_status, 'Employee is enabled successfully!')
    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function edit_oneself(actor_mail, attribute_name, new_value) {
    const response_obj = Response.get_empty_response()
    if (access_manager.has_access(actor_mail, Action.edit_oneself)) {
        switch (attribute_name) { //todo this can become enum
            case "full name":
                user_manager.change_full_name(actor_mail, new_value)
                response_obj.edit(success_status, 'Full name is edited successfully!')
                break
            case "working hours":
                user_manager.change_working_hours(actor_mail, new_value)
                response_obj.edit(success_status, 'Working hour is edited successfully!')
                break
            default:
                response_obj.edit(invalid_request_status, 'Only full name and working hours can be changed')
        }

    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function search_employees(actor_mail, department_name, office_name) {
    const response_obj = Response.get_empty_response()
    if (access_manager.has_access(actor_mail, Action.search_employees)) {
        const answer = user_manager.search(department_name, office_name)
        response_obj.edit(success_status, answer)

    } else response_obj.edit(access_denied_status, 'Invalid access.')
    return response_obj
}

function get_working_hour(actor_mail, employee_id) {
    const response_obj = Response.get_empty_response()
    if (access_manager.has_access(actor_mail, Action.get_working_hour)) {
        const answer = user_manager.get_working_hour(employee_id)
        if (answer === null) response_obj.edit(bad_request_status, 'No user with this id exists!')
        else response_obj.edit(success_status, {'working_hours': answer})
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