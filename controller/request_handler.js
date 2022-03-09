const Response = require("../models/response")
const business_handler = require("../business service/business_handler")
const User = require('../models/user')
const WorkingHour = require('../models/workingHour')
const {office, get_office} = require('../models/enums/office')
const {OrganizationLevel, get_organization_level} = require("../models/enums/organization_level");
const {get_department} = require("../models/enums/department");
const TimeFormat = require("hh-mm-ss");
const {Role, get_role} = require("../models/enums/role");


function get_working_hours(input_data) {
    let start_time, end_time
    try {
        // guide: TimeFormat.toS('137:00:00) is 493200
        start_time = TimeFormat.toS(input_data.working_hours.start_time)
        end_time = TimeFormat.toS(input_data.working_hours.end_time)
    } catch (e) {
        return null
    }
    return new WorkingHour(start_time, end_time)
}

function create_user_model(input_data, role) {
    if (!input_data.working_hours.start_time || !input_data.working_hours.end_time)
        return null
    const working_hours = get_working_hours(input_data)
    const office = get_office(input_data.office)
    const organization_level = get_organization_level(input_data.organization_level)
    const dep = get_department(input_data.department)

    if (!working_hours || !organization_level || !office || !dep) return null
    return new User(input_data.email, input_data.password, input_data.phone_number, input_data.full_name,
        dep, organization_level, office, working_hours, role);
}

async function sign_up_admin(data) {
    if (!(data.email && data.password && data.phone_number && data.full_name && data.department && data.organization_level && data.office && data.working_hours))
        return Response.get_bad_request_response('Signup fields are not complete.')
    const user = create_user_model(data, get_role('admin'));
    if (!user) return Response.get_bad_request_response('Signup fields are of invalid format.')
    try {
        return await business_handler.sign_up_admin(user)
    } catch (e) {
        console.log(e)
        return Response.get_unexpected_condition()
    }
}

async function sign_up_employee(actor_mail, data) {
    if (!actor_mail)
        return Response.get_bad_request_response()
    if (!(data.email && data.password && data.phone_number && data.full_name && data.department && data.organization_level && data.office &&
        data.working_hours && data.role))
        return Response.get_bad_request_response('Signup fields are not complete.')

    const user = create_user_model(data, get_role(data.role))
    if (!user) return Response.get_bad_request_response('Signup fields are of invalid format.')
    try {
        return await business_handler.sign_up_employee(actor_mail, user)
    } catch (e) {
        console.log(e)
        return Response.get_unexpected_condition()
    }
}

async function login(data) {
    if (!(data.email && data.password))
        return Response.get_bad_request_response('Email and password are required!')
    else try {
        return await business_handler.login(data.email, data.password)
    } catch (e) {
        console.log(e)
        return Response.get_unexpected_condition()
    }
}

async function logout(actor_email) {
    try {
        return await business_handler.logout(actor_email)
    } catch (e) {
        console.log(e)
        return Response.get_unexpected_condition()
    }
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
        const working_hour = await business_handler.get_working_hour(actor_mail, data.employee_id)
        return {
            start_time: working_hour.get_time_display(true),
            end_time: working_hour.get_time_display(false)
        }
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