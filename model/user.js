const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function hash_password(password) {
    return bcrypt.hashSync(password, 10);
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

    static new_login_user(user){
        User.online_users.push(user.id)
        user.is_logged_in = true
    }

    static logout_user(user){
        const index = User.online_users.indexOf(user.id)
        if(index === -1) return -1
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
        // return given_password.match(/(0-9)+/) && given_password.match(/(A-Za-z)+/)
        return /[0-9]+/.test(given_password) && /[A-Za-z]+/.test(given_password)
    }

    constructor(email, password, phone_number, full_name, department, organization, office, working_hours, is_admin) {
        this.id = User.last_id++
        this.email = email.toLowerCase()
        this.hashed_password = hash_password(password)    //todo we should encrypt the password and then save it
        this.phone_number = phone_number
        this.full_name = full_name
        this.departmant = department
        this.organization = organization
        this.office = office
        this.working_hours = working_hours

        this.is_logged_in = false
        if (is_admin) User.set_admin(this)
        User.all_users.push(this)
    }

    change_password(new_password) {
        this.hashed_password = hash_password(new_password)
    }

    async is_password_correct(entered_password) {
        try {
            return await bcrypt.compare(entered_password, this.hashed_password)
        } catch (error) {
            console.log(error) //todo what should we do here?
        }// return hash_password(entered_password) === this.hashed_password
    }


}

function initiateUser() {
    User.all_users = []
    User.online_users = []
    User.last_id = 0
    User.admin = null
}

initiateUser()
module.exports = User