const User = require("../../model/user");
const access_manager = require("./access_manager")
const Action = require("./actions")
const jwt = require("jsonwebtoken");
const {json} = require("express");


const success_status = 200
const access_denied_status = 403
const invalid_request_status = 406
const bad_request_status = 400


//we should parse the token in the data and find out who has sent this request
function authenticate_actor(data) {
    const token = data.token
    if (token.includes('admin')) return User.admin

    return undefined; //todo: It shouldn't be like this :)
}

function sign_up_admin(signup_data, res) {
    let json_msg, status_code = 406

    if (!User.can_have_admin()) {
        json_msg = {status: 'failure', message: 'An admin already exists!'}
    } else {
        if (User.can_create_user(signup_data.email, signup_data.password)) {
            new User(signup_data.email, signup_data.password, signup_data.phone_number, signup_data.full_name,
                signup_data.department, signup_data.organization, signup_data.office, signup_data.working_hours, true)
            json_msg = {status: 'success', message: 'Admin user is created successfully!'}
            status_code = success_status
        } else {
            json_msg = {status: 'failure', message: 'Sign up is invalid'}
        }
    }
    res.status(status_code).send(json_msg)
}

function sign_up_employee(signup_data, res) {
    const actor = authenticate_actor(signup_data)
    let json_msg, status_code
    if (access_manager.has_access(actor, Action.create_employee)) {
        if (User.can_create_user(signup_data.email, signup_data.password)) {
            new User(signup_data.email, signup_data.password, signup_data.phone_number, signup_data.full_name,
                signup_data.department, signup_data.organization, signup_data.office, signup_data.working_hours, false)
            json_msg = {status: 'success', message: 'Employee is created successfully!'}
            status_code = success_status
        } else {
            json_msg = {
                status: 'failure',
                message: 'Sign up is invalid. Either password is weak or the email is repeated'
            }
            status_code = invalid_request_status
        }
    } else {
        json_msg = {status: 'failure', message: 'access denied'}
        status_code = access_denied_status
    }
    res.status(status_code).send(json_msg)
}

async function create_access_token(email, id) {
    // process.env.TOKEN_KEY = "it should've been secret" //todo it shouldn't be hard coded like this
    return jwt.sign(
        {user_id: id, email: email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );


}

async function login(data, res) {
    let given_email = data.email
    const given_pass = data.password
    if (!(given_email && given_pass)) {
        res.status(bad_request_status).send({status: "failure", message: "Email and password are required!"})
    } else {
        given_email = given_email.toLowerCase()
        const user = User.get_user_by_email(given_email)
        if (!user || !(await user.is_password_correct(given_pass))) {
            res.status(invalid_request_status).send({status: "failure", message: "Email or password is not correct!"})
        } else if (user.is_logged_in) {
            res.status(invalid_request_status).send({status: "failure", message: "User is already logged in!"})
        } else {
            const token = create_access_token(given_email, user.id)
            user.token = token
            User.new_login_user(user)
            res.status(success_status).send({status: "success", message: "login successful!", token: token})
            // res.status(success_status).send({
            //     status: "success",
            //     message: "login successful!",
            //     token: "supposed to be a token"
            // })
        }
    }
}

function logout(data, res) {
    const actor = authenticate_actor(data)
    if (access_manager.has_access(actor, Action.logout)) {
        const logout_status = User.logout_user(actor)
        if (logout_status === 0)
            res.status(success_status).send({status: 'success', message: 'User logged out successfully!'})
        else {
            res.status(invalid_request_status).send({status: 'failure', message: 'User logged is not logged in!'})
        }
    }

}

module.exports = {sign_up_admin, sign_up_employee, login, logout}