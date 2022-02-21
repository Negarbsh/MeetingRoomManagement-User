class Action {
}

const create_employee = new Action()
const sign_up_admin = new Action()
const logout = new Action()
const show_employee_list = new Action()
const view_employee = new Action()
const edit_employee = new Action()
const disable_employee = new Action()
const enable_employee = new Action()
const edit_oneself = new Action()
const search_employees = new Action()
const get_working_hour = new Action()

module.exports = {
    create_employee,
    sign_up_admin,
    logout,
    show_employee_list,
    view_employee,
    edit_employee,
    disable_employee,
    enable_employee,
    edit_oneself,
    search_employees,
    get_working_hour
}