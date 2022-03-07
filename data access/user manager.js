const objectionUser = require('../models/objection_user')

const bcrypt = require("bcryptjs");

function hash_password(password) {
    return bcrypt.hashSync(password + process.env.PASSWORD_KEY, 10);
}

let admin = null

async function create_employee(user) {
    if (!user) return null
    const existing_user = await get_user_by_email(user.email)
    if (existing_user) return existing_user

    const hashed_password = hash_password(user.password)
    return objectionUser.query().insert({
        email: user.email,
        hashed_password: hashed_password,
        phone_number: user.phone_number,
        full_name: user.full_name,
        department: user.department,
        organization_level: user.organization_level,
        office: user.office,
        working_hours: user.working_hours,
        role: user.role,
        is_active: true,
        is_admin: false,
        is_logged_in: false
    });

}

async function create_admin(user) {
    if (!user) return null
    if (await get_user_by_email(user.email)) return null

    const hashed_password = hash_password(user.password)
    const userObject = await objectionUser.query().insert({
        email: user.email,
        hashed_password: hashed_password,
        phone_number: user.phone_number,
        full_name: user.full_name,
        department: user.department,
        organization_level: user.organization_level,
        office: user.office,
        working_hours: user.working_hours,
        role: 'admin', //todo should be enum
        is_active: true,
        is_admin: true,
        is_logged_in: false
    });
    set_admin(user)
    return userObject
}

async function get_user_by_email(email) {
    const user = await objectionUser.query().select('*').where('email', '=', email)
    if (user.length === 0) return null
    return user[0];
}

async function get_user_by_id(id) {
    return objectionUser.query().findById(id)
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

async function disable_user(user_id) {
    await objectionUser.query()
        .findById(user_id)
        .patch({
            is_active: false
        });
}

async function enable_user(user_id) {
    await objectionUser.query()
        .findById(user_id)
        .patch({
            is_active: true
        });
}

async function login_user(user) {
    if (can_login(user)) {
        user.is_logged_in = true
        await objectionUser.query()
            .findById(user.id)
            .patch({
                is_logged_in: true
            });
    }
}

async function logout_user(mail) {
    const user = await get_user_by_email(mail)
    if (!user) return -1
    await objectionUser.query()
        .findById(user.id)
        .patch({
            is_logged_in: false
        });
    return 0
}

async function can_create_user(email) {
    const user = await get_user_by_email(email)
    return !user;
}

async function get_employee_list() {
    return objectionUser.query().select('id', 'full_name', 'department', 'office')
}

async function get_attributes(user_id) {
    return objectionUser.query().select('email', 'phone_number', 'full_name', 'department', 'office', 'organization_level', 'working_hours', 'role', 'is_active').findById(user_id)
}

//returns true if the process was successful (the user id was valid)
async function edit_administrative_attributes(user_id, attributes) {
    return objectionUser.query().findById(user_id).patch({
        full_name: attributes.full_name,
        department: attributes.department,
        organization_level: attributes.organization_level,
        office: attributes.office,
        working_hours: attributes.working_hours,
        role: attributes.role,
        is_active: attributes.is_active
    })
}

async function search(department_name, office_name) {
    let search_result
    if (department_name && office_name)
        search_result = await objectionUser.query().select('id', 'email', 'phone_number', 'full_name', 'department', 'office', 'organization_level', 'working_hours', 'role', 'is_active')
            .where('department', '=', department_name)
            .where('office', '=', office_name).orderBy('id');
    else if (department_name)
        search_result = await objectionUser.query().select('id', 'email', 'phone_number', 'full_name', 'department', 'office', 'organization_level', 'working_hours', 'role', 'is_active')
            .where('department', '=', department_name)
    else if (office_name)
        search_result = await objectionUser.query().select('id', 'email', 'phone_number', 'full_name', 'department', 'office', 'organization_level', 'working_hours', 'role', 'is_active')
            .where('office', '=', office_name).orderBy('id')
    else return null
    return Object.assign({}, ...search_result.map((x) => ({[x.id]: x})));
}

async function get_working_hour(user_id) {
    return objectionUser.query().select('working_hours').findById(user_id);
}


async function change_working_hours(email, new_working_hours) {
    const user = await get_user_by_email(email)
    const id = user.$id()
    await objectionUser.query()
        .findById(id)
        .patch({
            working_hours: new_working_hours
        });
}


async function change_full_name(email, new_full_name) {
    const user = await get_user_by_email(email)
    const id = user.$id() //what is it?
    await objectionUser.query()
        .findById(id)
        .patch({
            full_name: new_full_name
        });
}

async function delete_user(email) {
    const user = await get_user_by_email(email)
    if (user)
        await objectionUser.query().deleteById(user.$id());
}


async function is_password_correct(user, given_password) {
    try {
        return bcrypt.compare(given_password + process.env.PASSWORD_KEY, user.hashed_password)
        // return bcrypt.compare(given_password, user.hashed_password)
    } catch (error) {
        console.log(error)
        return false
    }

}

async function load_admin() {
    const admins = await objectionUser.query().select('*').where('is_admin', '=', 't')
    set_admin(admins[0])
}

async function is_admin(email) {
    if (!admin) {
        await load_admin()
        if (!admin)
            return false
    }
    return admin.email === email
}

module.exports = {
    is_admin,
    create_admin,
    create_employee,
    get_user_by_id,
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
    change_working_hours,
    delete_user,
    is_password_correct
}