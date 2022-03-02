const Response = require("../models/response")
const business_handler = require("../business services/business_handler")


async function sign_up_admin(data) {
    if (!(data.email && data.password && data.phone_number && data.full_name && data.department && data.organization_level && data.office && data.working_hours))
        return Response.get_bad_request_response('Signup fields are not complete.')
    else
        try {
            return await business_handler.sign_up_admin(data.email, data.password, data.phone_number, data.full_name, data.department, data.organization_level, data.office, data.working_hours)
        } catch (e) {
            return Response.get_unexpected_condition()
        }
}

async function sign_up_employee(actor_mail, data) {
    if (!actor_mail)
        return Response.get_bad_request_response()
    if (!(data.email && data.password && data.phone_number && data.full_name && data.department && data.organization_level && data.office &&
        data.working_hours && data.role))
        return Response.get_bad_request_response('Signup fields are not complete.')
    else
        try {
            return await business_handler.sign_up_employee(actor_mail, data.email, data.password, data.phone_number, data.full_name, data.department, data.organization_level,
                data.office, data.working_hours, data.role)
        } catch (e) {
            return Response.get_unexpected_condition()
        }
}

async function login(data) {
    if (!(data.email && data.password))
        return Response.get_bad_request_response('Email and password are required!')
    else try {
        return await business_handler.login(data.email, data.password)
    } catch (e) {
        return Response.get_unexpected_condition()
    }
}

async function logout(actor_email) {
    await business_handler.logout(actor_email)
}

async function show_employee_list(actor_mail) {
    try {
        return await business_handler.show_employee_list(actor_mail) //todo the employee list that the business layer returns, isn't necessarily in the format that we want to send as a response
    } catch (e) {
        return Response.get_unexpected_condition()
    }
}

async function view_employee(actor_mail, data) {
    if (!'employee_id' in data)
        return Response.get_bad_request_response('No employee id specified!')
    try {
        return await business_handler.view_employee(actor_mail, data.employee_id)
    } catch (e) {
        return Response.get_unexpected_condition()
    }
}

async function edit_employee(actor_mail, data) {
    if (!'employee_id' in data)
        return Response.get_bad_request_response('No "employee_id" specified!')
    if (!'attributes' in data)
        return Response.get_bad_request_response('No "attributes" field specified!')
    try {
        return await business_handler.edit_employee(actor_mail, data.employee_id, data.attributes)
    } catch (e) {
        return Response.get_unexpected_condition()
    }
}

async function disable_employee(actor_mail, data) {
    if (!'employee_id' in data)
        return Response.get_bad_request_response('No "employee_id" specified!')
    try {
        return await business_handler.disable_employee(actor_mail, data.employee_id)
    } catch (e) {
        return Response.get_unexpected_condition()
    }
}

async function enable_employee(actor_mail, data) {
    if (!'employee_id' in data)
        return Response.get_bad_request_response('No "employee_id" specified!')
    try {
        return await business_handler.enable_employee(actor_mail, data.employee_id)
    } catch (e) {
        return Response.get_unexpected_condition()
    }
}

async function edit_profile(actor_mail, data) {
    if (!'attribute' in data)
        return Response.get_bad_request_response('No "attribute" specified!')
    if (data.attribute !== 'full_name' && data.attribute !== 'working_hour')
        return Response.get_bad_request_response('Attribute should be "working_hour" or "full_name"')
    if (!'new_value' in data)
        return Response.get_bad_request_response('No "new_value" specified!')
    try {
        return await business_handler.edit_oneself(actor_mail, data.attribute, data.new_value)
    } catch (e) {
        return Response.get_unexpected_condition()
    }
}

async function search(actor_mail, data) {
    // if (!'department' in data)
    //     return Response.get_bad_request_response('No "department" specified!')
    // if (!'office' in data)
    //     return Response.get_bad_request_response('No "office" specified!')
    try {

        return await business_handler.search_employees(actor_mail, data.department, data.office)
    } catch (e) {
        return Response.get_unexpected_condition()
    }
}

async function get_working_hour(actor_mail, data) {
    if (!'employee_id' in data)
        return Response.get_bad_request_response('No "employee_id" specified!')
    try {
        return await business_handler.get_working_hour(actor_mail, data.employee_id)
    } catch (e) {
        return Response.get_unexpected_condition()
    }
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
    edit_profile,
    search,
    get_working_hour
}