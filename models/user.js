class User {
    constructor(email, password, phone_number, full_name, department, organization, office, working_hours, role) {
        this.email = email.toLowerCase()
        this.password = password
        this.phone_number = phone_number
        this.full_name = full_name
        this.department = department
        this.organization_level = organization
        this.office = office
        this.working_hours = working_hours
        this.role = role
    }


}

module.exports = User