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

    static login_user(user, token) {
        User.online_users.push(user.id)
        user.is_logged_in = true
        user.token = token
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

    static edit_attributes(user_id, attributes) {
        const user = User.get_user_by_id(user_id)
        if (user) {
            user.edit(attributes.full_name, attributes.department, attributes.organization_level, attributes.office, attributes.working_hours, attributes.role, attributes.is_active)
            return true
        }
        return false
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