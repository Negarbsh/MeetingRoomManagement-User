const User = require('../model/user')


const all_users = {}
const online_users = []
const admin = null
const employee_list = []


function create_employee( email, password, phone_number, full_name, department, organization_level, office,
                          working_hours, role) {
    const user = new User(email,password, phone_number, full_name,
        department, organization_level, office, working_hours, role, true, false)

    //todo dictionary
    all_users.push(this)
    if (!is_admin) User.employee_list.push({
        "id": this.id,
        "full name": this.full_name,
        "department": this.department,
        "office": this.office
    })
}

function create_admin( email, password, phone_number, full_name, department, organization_level, office, working_hours) {
    new User(email, password, phone_number, full_name,
        department, organization_level, office, working_hours, 'admin', true, true)
}

function get_user_by_email(email) {
    for (const user of all_users) {
        if (user.email === email.toLowerCase()) return user
    }
    return null
}

function get_user_by_id(id) {
    for (const user of User.all_users) {
        if (user.id === id) return user
    }
    return null
}


module.exports = {create_admin, create_employee, get_user_by_email, get_user_by_id}