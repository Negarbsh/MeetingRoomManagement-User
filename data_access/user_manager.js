const objectionUser = require('../models/objection_user')

const bcrypt = require("bcryptjs");

function hash_password(password) {
    return bcrypt.hashSync(password + process.env.PASSWORD_KEY, 10);
}

class user_manager {

    static is_mocked() {
        return false;
    }

    static async create_employee(user) {
        if (!user) return null
        const existing_user = await user_manager.get_user_by_email(user.email)
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

    static async create_admin(user) {
        if (!user) return null
        if (await user_manager.get_user_by_email(user.email)) return null

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
        user_manager.set_admin(user)
        return userObject
    }

    static async get_user_by_email(email) {
        const user = await objectionUser.query().select('*').where('email', '=', email)
        if (user.length === 0) return null
        return user[0];
    }

    static async get_user_by_id(id) {
        return objectionUser.query().findById(id)
    }


    static has_admin() {
        return user_manager.admin !== null
    }

    static set_admin(new_admin) {
        user_manager.admin = new_admin
    }

    static async get_admin_mail() {
        if (user_manager.admin === null)
            await user_manager.load_admin()
        if (user_manager.admin !== null)
            return user_manager.admin.email
        return null
    }

    static can_login(user) {
        if (user)
            return user.is_active && !user.is_logged_in
        return false
    }

    static async disable_user(user_id) {
        await objectionUser.query()
            .findById(user_id)
            .patch({
                is_active: false
            });
    }

    static async enable_user(user_id) {
        await objectionUser.query()
            .findById(user_id)
            .patch({
                is_active: true
            });
    }

    static async login_user(user) {
        if (user_manager.can_login(user)) {
            user.is_logged_in = true
            await objectionUser.query()
                .findById(user.id)
                .patch({
                    is_logged_in: true
                });
        }
    }

    static async logout_user(mail) {
        const user = await user_manager.get_user_by_email(mail)
        if (!user) return -1
        await objectionUser.query()
            .findById(user.id)
            .patch({
                is_logged_in: false
            });
        return 0
    }

    static async can_create_user(email) {
        const user = await user_manager.get_user_by_email(email)
        return !user;
    }

    static async get_employee_list() {
        return objectionUser.query().select('id', 'full_name', 'department', 'office')
    }

    static async get_attributes(user_id) {
        return objectionUser.query().select('email', 'phone_number', 'full_name', 'department', 'office', 'organization_level', 'working_hours', 'role', 'is_active').findById(user_id)
    }

//returns true if the process was successful (the user id was valid)
    static async edit_administrative_attributes(user_id, attributes) {
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

    static async search(department_name, office_name) {
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
        return Object.assign({}, ...search_result.map((x) => ({[x.$id]: x})));
    }

    static async get_working_hour(user_id) {
        return objectionUser.query().select('working_hours').findById(user_id);
    }


    static async change_working_hours(email, new_working_hours) {
        const user = await user_manager.get_user_by_email(email)
        const id = user.$id()
        await objectionUser.query()
            .findById(id)
            .patch({
                working_hours: new_working_hours
            });
    }


    static async change_full_name(email, new_full_name) {
        const user = await user_manager.get_user_by_email(email)
        const id = user.$id() //what is it?
        await objectionUser.query()
            .findById(id)
            .patch({
                full_name: new_full_name
            });
    }

    static async delete_user(email) {
        const user = await user_manager.get_user_by_email(email)
        if (user)
            await objectionUser.query().deleteById(user.$id());
    }


    static async is_password_correct(user, given_password) {
        try {
            return bcrypt.compare(given_password + process.env.PASSWORD_KEY, user.hashed_password)
            // return bcrypt.compare(given_password, user.hashed_password)
        } catch (error) {
            console.log(error)
            return false
        }

    }

    static async load_admin() {
        const admins = await objectionUser.query().select('*').where('is_admin', '=', 't')
        user_manager.set_admin(admins[0])
    }

    static async is_admin(email) {
        if (!user_manager.admin) {
            await user_manager.load_admin()
            if (!user_manager.admin)
                return false
        }
        return user_manager.admin.email === email
    }

}

user_manager.admin = null

module.exports = user_manager
