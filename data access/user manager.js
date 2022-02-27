const User = require('../model/user')

const all_users = {}
const all_users_by_mail = {}
const online_users = []
let admin = null
const employee_list = {}
let last_id = 0

function create_employee(email, password, phone_number, full_name, department, organization_level, office, working_hours, role) {
    const user_id = last_id++
    const user = new User(user_id, email.toLowerCase(), password, phone_number, full_name,
        department, organization_level, office, working_hours, role, true, false)
    all_users[user_id] = user
    all_users_by_mail[email.toLowerCase()] = user
    employee_list[user_id] = {
        "id": user_id,
        "full name": full_name,
        "department": department,
        "office": office
    }
    return user
}

function create_admin(email, password, phone_number, full_name, department, organization_level, office, working_hours) {
    const user_id = last_id++
    const user = new User(user_id, email, password, phone_number, full_name,
        department, organization_level, office, working_hours, 'admin', true, true)
    all_users[user_id] = user
    all_users_by_mail[email.toLowerCase()] = user
    set_admin(user)
    return user
}

function get_user_by_email(email) {
    return all_users_by_mail[email]
}

function get_user_by_id(id) {
    return all_users[id]
}


function has_admin() {
    return admin !== null
}

function set_admin(new_admin) {
    admin = new_admin
}

function get_admin_mail() {
    if (admin !== null)
        return admin.email
    return null
}

function can_login(user) {
    if (user)
        return user.is_active && !user.is_logged_in
    return false
}

function disable_user(user_id) { //todo what do we do if the user was the admin!?
    const user = get_user_by_id(user_id)
    if (user)
        user.is_active = false
}

function enable_user(user_id) {
    const user = get_user_by_id(user_id)
    if (user) user.is_active = true
}

function login_user(user) {
    if (can_login(user)) {
        online_users.push(user.id)
        user.is_logged_in = true
    }
}

function logout_user(mail) {
    const user = get_user_by_email(mail)
    const index = online_users.indexOf(user.id)
    if (index === -1) return -1
    online_users.splice(index)
    user.is_logged_in = false
    return 0
}

function can_create_user(email, given_password) {
    const user = get_user_by_email(email)
    if (user) return false
    return is_password_strong(given_password)
}


function is_password_strong(given_password) {
    if (given_password.length < 10) return false
    return /[0-9]+/.test(given_password) && /[A-Za-z]+/.test(given_password)
}

function get_employee_list() {
    return employee_list
}

function get_attributes(user_id) {
    const user = get_user_by_id(user_id)
    if (!user) return null
    return {
        'email': user.email,
        'phone number': user.phone_number,
        'full name': user.full_name,
        'department': user.department,
        'organization level': user.organization_level,
        'office': user.office,
        'working hours': user.working_hours,
        'role': user.role,
        'active/not active status': user.get_active_status()
    }
}

function edit_administrative_attributes(user_id, attributes) {
    const user = get_user_by_id(user_id)
    if (user) {
        user.edit(attributes.full_name, attributes.department, attributes.organization_level,
            attributes.office, attributes.working_hours, attributes.role, attributes.is_active)
        return true
    }
    return false
}

function filter_by_department(department_name, current_search_space) {
    const new_space = {}
    if (!current_search_space) {
        current_search_space = {...all_users}
    }
    if (!department_name) return current_search_space
    for (const user_id in current_search_space) {
        const user = current_search_space[user_id]
        if (user.department === department_name)
            new_space[user_id] = user
    }
    return new_space
}

function filter_by_office(office_name, current_search_space) {
    const new_space = {}
    if (!current_search_space) {
        current_search_space = {...all_users}
    }
    if (!office_name) return current_search_space
    for (const user_id in current_search_space) {
        const user = current_search_space[user_id]
        if (user.office === office_name)
            new_space[user_id] = user
    }
    return new_space
}

function search(department_name, office_name) {
    return filter_by_office(office_name, filter_by_department(department_name))
}

function get_working_hour(user_id) {
    const user = get_user_by_id(user_id)
    if (!user) return null
    return user.working_hours
}


function change_working_hours(email, new_working_hours) {
    const user = get_user_by_email(email)
    user.change_working_hours(new_working_hours)
}


function change_full_name(email, new_full_name) {
    const user = get_user_by_email(email)
    user.change_name(new_full_name)
}


module.exports = {
    create_admin,
    create_employee,
    get_user_by_email,
    has_admin,
    can_login,
    disable_user,
    enable_user,
    login_user,
    logout_user,
    can_create_user,
    get_employee_list,
    get_attributes,
    edit_administrative_attributes,
    search,
    get_working_hour,
    get_admin_mail,
    change_full_name,
    change_working_hours
}