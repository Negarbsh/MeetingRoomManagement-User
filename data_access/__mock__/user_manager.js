class user_manager {

    static async create_employee(user) {
        if (!user) return null
        const existing_user = await user_manager.get_user_by_email(user.email)
        if (existing_user) return existing_user

        user.is_active = true
        user.is_admin = false
        user.is_logged_in = false
        user.id = last_id++
        all_users_by_mail[user.email] = user
        all_users_by_id[user.id] = user

        employee_list[user.id] = {
            "id": user.id,
            "full name": user.full_name,
            "department": user.department,
            "office": user.office
        }
        return user
    }

    static async create_admin(user) {
        if (!user) return null
        if (await user_manager.get_user_by_email(user.email)) return null
        user.is_active = true
        user.is_admin = true
        user.is_logged_in = false
        user.id = last_id++
        all_users_by_mail[user.email] = user
        all_users_by_id[user.id] = user
        set_admin(user)
        return user
    }

    static async get_user_by_email(email) {
        return await all_users_by_mail[email]
    }

    static async get_user_by_id(id) {
        return all_users_by_id[id]
    }


    static has_admin() {
        return admin !== null
    }

    static set_admin(new_admin) {
        admin = new_admin
    }

    static get_admin_mail() {
        if (admin !== null)
            return admin.email
        return null
    }

    static can_login(user) {
        if (user)
            return user.is_active && !user.is_logged_in
        return false
    }

    static async disable_user(user_id) {
        const user = await user_manager.get_user_by_id(user_id)
        user.is_active = false
    }

    static async enable_user(user_id) {
        const user = await user_manager.get_user_by_id(user_id)
        user.is_active = true
    }

    static async login_user(user) {
        if (user_manager.can_login(user)) {
            user.is_logged_in = true
        }
    }

    static async logout_user(mail) {
        const user = await user_manager.get_user_by_email(mail)
        if (!user) return -1
        user.is_logged_in = false
        return 0
    }

    static async can_create_user(email) {
        const user = await user_manager.get_user_by_email(email)
        return !user;
    }

    static async get_employee_list() {
        return employee_list
    }

    static async get_attributes(user_id) {
        const user = await user_manager.get_user_by_id(user_id)
        if (!user) return null
        return {
            "email": user.email,
            "phone_number": user.phone_number,
            "department": user.department,
            "office": user.office,
            "organization_level": user.organization_level,
            "working_hours": user.working_hours,
            "role": user.role,
            "is_active": user.is_active
        }
    }

//returns true if the process was successful (the user id was valid)
    static async edit_administrative_attributes(user_id, attributes) {
        const user = await user_manager.get_user_by_id(user_id)
        if (!user) return false

        user.full_name = attributes.full_name
        user.department = attributes.department
        user.organization_level = attributes.organization_level
        user.office = attributes.office
        user.working_hours = attributes.working_hours
        user.role = attributes.role
        user.is_active = attributes.is_active

        return true
    }

    static filter_by_department(department_name, current_search_space) {
        const new_space = {}
        if (!current_search_space) {
            current_search_space = {...all_users_by_id}
        }
        if (!department_name) return current_search_space
        for (const user_id in current_search_space) {
            const user = current_search_space[user_id]
            if (user.department === department_name)
                new_space[user_id] = user
        }
        return new_space
    }

    static filter_by_office(office_name, current_search_space) {
        const new_space = {}
        if (!current_search_space) {
            current_search_space = {...all_users_by_id}
        }
        if (!office_name) return current_search_space
        for (const user_id in current_search_space) {
            const user = current_search_space[user_id]
            if (user.office === office_name)
                new_space[user_id] = user
        }
        return new_space
    }

    static search(department_name, office_name) {
        return user_manager.filter_by_office(office_name, user_manager.filter_by_department(department_name))
    }


    static async get_working_hour(user_id) {
        const user = user_manager.get_user_by_id(user_id)
        if (!user) return null
        return user.working_hours
    }


    static async change_working_hours(email, new_working_hours) {
        const user = await user_manager.get_user_by_email(email)
        user.working_hours = new_working_hours
    }


    static async change_full_name(email, new_full_name) {
        const user = await user_manager.get_user_by_email(email)
        user.full_name = new_full_name
    }

    static async delete_user(email) {
        const user = await user_manager.get_user_by_email(email)
        if (user) {
            delete all_users_by_id[user.id]
            delete all_users_by_mail[user.email]
            //todo remove the user from employee list!
        }
    }


    static async is_password_correct(user, given_password) {
        return user.password === given_password
    }

    static async load_admin() {
    }

    static async is_admin(email) {
        if (!admin) return false
        return admin.email === email
    }

}


let admin = null
const all_users_by_mail = {}
const all_users_by_id = {}
const employee_list = []
let last_id = 0

module.exports = user_manager
