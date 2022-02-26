const express = require('express');
const request_handler = require("../controller/request_handler")
const Response = require("../model/response")
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


function decode_token(req) {
    const token = req.header('token')
    let decoded_token
    try {
        jwt.verify(token, process.env.TOKEN_KEY, {}, function (err, decoded) {
            if (err) throw new Error(err)
            decoded_token = decoded //token info is returned in 'decoded'
        })
        return decoded_token
    } catch (e) {
        return null
    }
}


app.post('/sign_up_admin', async (req, res) => {
    const data = req.body
    const response_obj = request_handler.sign_up_admin(data)
    response_obj.send_response(res)
});


app.post('/create_employee', async (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        const data = req.body
        response_obj = request_handler.sign_up_employee(decoded_token.email, data)
    }
    response_obj.send_response(res)
});


app.post('/login', async (req, res) => {
    const data = req.body
    const response_obj = request_handler.login(data)
    response_obj.send_response(res)
})


app.post('/logout', async (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        response_obj = request_handler.logout(decoded_token.email)
    }
    response_obj.send_response(res)
})


app.post('/admin_panel/show_employee_list', (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        const data = req.body
        response_obj = request_handler.show_employee_list(decoded_token.email, data)
    }
    response_obj.send_response(res)
});


app.post('/admin_panel/show_employee_list/view_employee', (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        const data = req.body
        response_obj = request_handler.view_employee(decoded_token.email, data)
    }
    response_obj.send_response(res)
})


app.post('/admin_panel/show_employee_list/edit_employee', (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        const data = req.body
        response_obj = request_handler.edit_employee(decoded_token.email, data)
    }
    response_obj.send_response(res)
})


app.post('/admin_panel/show_employee_list/disable_employee', (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        const data = req.body
        response_obj = request_handler.disable_employee(decoded_token.email, data)
    }
    response_obj.send_response(res)
})


app.post('/admin_panel/show_employee_list/enable_employee', (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        const data = req.body
        response_obj = request_handler.enable_employee(decoded_token.email, data)
    }
    response_obj.send_response(res)
})


app.post('/edit_profile', (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        const data = req.body
        response_obj = request_handler.edit_profile(decoded_token.email, data)
    }
    response_obj.send_response(res)
})


app.post('/search', (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        const data = req.body
        response_obj = request_handler.search(decoded_token.email, data)
    }
    response_obj.send_response(res)
})

app.post('/get_working_hour', (req, res) => {
    const decoded_token = decode_token(req)
    let response_obj
    if (!decoded_token)
        response_obj = Response.get_invalid_token_response()
    else {
        const data = req.body
        response_obj = request_handler.get_working_hour(decoded_token.email, data)
    }
    response_obj.send_response(res)
})

module.exports = app

