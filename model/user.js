const bcrypt = require("bcryptjs");

function hash_password(password) {
    return bcrypt.hashSync(password, 10); //todo hash salt
}

class User {

    static can_have_admin() {
        return User.admin === null
    }

    static set_admin(admin) {
        if (this.can_have_admin())
            User.admin = admin
    }

    static get_user_by_email(email) {
        for (const user of User.all_users) {
            if (user.email === email.toLowerCase()) return user
        }
        return null
    }

    static get_user_by_id(id) {
        for (const user of User.all_users) {
            if (user.id === id) return user
        }
        return null
    }

    static can_login(user) {
        if (user)
            return user.is_active && !user.is_logged_in
        return false
    }

    static disable_user(user_id) { //todo what do we do if the user was the admin!?
        const user = this.get_user_by_id(user_id)
        if (user) {
            user.is_active = false
        }
        if (user.is_logged_in) {
            // user.token.disable() todo (should be done after we created a token class)
        }
    }

    static enable_user(user_id) {
        const user = this.get_user_by_id(user_id)
        if (user) user.is_active = true
    }

    static login_user(user, token) {
        if (User.can_login(user)) {
            User.online_users.push(user.id)
            user.is_logged_in = true
            user.token = token
        }
    }

    static logout_user(user) {
        const index = User.online_users.indexOf(user.id)
        if (index === -1) return -1
        User.online_users.splice(index)
        user.is_logged_in = false
        return 0
    }

    static can_create_user(email, given_password) {
        const user = User.get_user_by_email(email)
        if (user) return false
        return User.is_password_strong(given_password)
    }


    static is_password_strong(given_password) {
        if (given_password.length < 10) return false
        return /[0-9]+/.test(given_password) && /[A-Za-z]+/.test(given_password)
    }

    static get_employee_list() {
        return User.employee_list
    }

    static get_attributes(user_id) {
        const user = User.get_user_by_id(user_id)
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

    static edit_administrative_attributes(user_id, attributes) {
        const user = User.get_user_by_id(user_id)
        if (user) {
            user.edit(attributes.full_name, attributes.department, attributes.organization_level,
                attributes.office, attributes.working_hours, attributes.role, attributes.is_active)
            return true
        }
        return false
    }

    static filter_by_department(department_name, current_list) {
        const new_list = []
        if (!current_list) {
            current_list = User.all_users.slice()
        }
        if (!department_name) return current_list
        for (const user in current_list) {
            if (user.department === department_name)
                new_list.push(user)
        }
        return new_list
    }

    static filter_by_office(office_name, current_list) {
        const new_list = []
        if (!current_list) {
            current_list = User.all_users.slice()
        }
        if (!office_name) return current_list
        for (const user in current_list) {
            if (user.office === office_name)
                new_list.push(user)
        }
        return new_list
    }

    static search(department_name, office_name) {
        return this.filter_by_office(office_name, this.filter_by_department(department_name))
    }

    static get_working_hour(user_id) {
        const user = this.get_user_by_id(user_id)
        if (!user) return null
        return user.working_hours
    }

    constructor(email, password, phone_number, full_name, department, organization, office, working_hours, role, is_active, is_admin) {
        this.id = User.last_id++
        this.email = email.toLowerCase()
        this.hashed_password = hash_password(password)
        this.phone_number = phone_number
        this.full_name = full_name
        this.department = department
        this.organization_level = organization
        this.office = office
        this.working_hours = working_hours
        this.role = role

        if (!is_active) this.is_active = true
        this.is_active = is_active

        this.is_logged_in = false
        if (is_admin) User.set_admin(this)
        this.is_admin = is_admin

        User.all_users.push(this)
        if (!is_admin) User.employee_list.push({
            "id": this.id,
            "full name": this.full_name,
            "department": this.department,
            "office": this.office
        })
    }


    get_active_status() {
        if (this.is_active)
            return 'active'
        return 'not active'
    }


    change_password(new_password) {
        this.hashed_password = hash_password(new_password)
    }

    change_name(new_name) {
        this.full_name = new_name
    }

    change_working_hours(new_working_hour) {
        this.working_hours = new_working_hour
    }

    async is_password_correct(entered_password) {
        try {
            return await bcrypt.compare(entered_password, this.hashed_password)
        } catch (error) {
            console.log(error)
        }
    }

    edit(full_name, department, organization_level, office, working_hours, role, is_active) {
        if (full_name) this.full_name = full_name
        if (organization_level) this.organization_level = organization_level
        if (office) this.office = office
        if (working_hours) this.working_hours = working_hours
        if (role) this.role = role
        if (is_active) this.is_active = is_active
    }

}

function initiateUser() {
    User.all_users = []
    User.online_users = []
    User.last_id = 0
    User.admin = null
    User.employee_list = []
}

initiateUser()
module.exports = User