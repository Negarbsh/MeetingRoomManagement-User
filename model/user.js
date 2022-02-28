const bcrypt = require("bcryptjs");

function hash_password(password) {
    return bcrypt.hashSync(password, 10); //todo hash salt
}

class User {

    constructor(id, email, password, phone_number, full_name, department, organization, office, working_hours, role, is_active, is_admin) {
        this.id = id
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
        this.is_admin = is_admin

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

module.exports = User