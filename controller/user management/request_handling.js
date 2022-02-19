const User = require("../../model/user");
const access_manager = require("./access_manager")
const Action = require("./actions")
const jwt = require("jsonwebtoken");
const {json} = require("express");
const jwt_decode = require('jwt-decode')

const success_status = 200
const access_denied_status = 403
const invalid_request_status = 406
const bad_request_status = 400


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
    const actor = access_manager.authenticate_actor(signup_data.token)
    let json_msg, status_code
    // const response = new Response()
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

function login(data, res) {
    let given_email = data.email
    const given_pass = data.password
    if (!(given_email && given_pass)) {
        res.status(bad_request_status).send({status: "failure", message: "Email and password are required!"})
    } else {
        given_email = given_email.toLowerCase()
        const user = User.get_user_by_email(given_email)
        if (!user || !(user.is_password_correct(given_pass))) {
            res.status(invalid_request_status).send({status: "failure", message: "Email or password is not correct!"})
        } else if (user.is_logged_in) {
            res.status(invalid_request_status).send({status: "failure", message: "User is already logged in!"})
        } else {
            const token = access_manager.create_access_token(given_email, user.id)
            User.login_user(user, token)
            res.status(success_status).send({status: "success", message: "login successful!", token: token})
        }
    }
}

function logout(data, res) {
    const actor = access_manager.authenticate_actor(data.token)
    if (access_manager.has_access(actor, Action.logout)) {
        const logout_status = User.logout_user(actor)
        if (logout_status === 0)
            res.status(success_status).send({status: 'success', message: 'User logged out successfully!'})
        else {
            res.status(invalid_request_status).send({status: 'failure', message: 'User logged is not logged in!'})
        }
    } else {
        res.status(access_denied_status).send({status: 'failure', message: 'Invalid access.'})
    }

}

function show_employee_list(data, res) {
    const actor = access_manager.authenticate_actor(data.token)
    if (access_manager.has_access(actor, Action.show_employee_list)) {
        // see a list of employees with the following details
        //
        // First Name and Last Name
        // Team
        // Office
        const employee_list = User.get_employee_list().stringify()
        res.status(success_status).send({status: 'success', message: employee_list})


    } else {
        res.status(access_denied_status).send({status: 'failure', message: 'Invalid access.'})
    }
}

module.exports = {sign_up_admin, sign_up_employee, login, logout, show_employee_list}