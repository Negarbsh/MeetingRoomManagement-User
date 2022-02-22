const express = require('express');
const request_handler = require("./controller/user management/request_handling")

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//the request should be a json that has all user's fields
app.post('/sign_up_admin', async (req, res) => {
    const data = req.body
    const response_obj = request_handler.sign_up_admin(data)
    response_obj.send_response(res)
});

//the request should be a json that has all user's fields
app.post('/create_employee', async (req, res) => {
    const data = req.body
    const response_obj = await request_handler.sign_up_employee(data)
    response_obj.send_response(res)

});


app.post('/login', async (req, res) => {
    const data = req.body
    const response_obj = await request_handler.login(data)
    response_obj.send_response(res)
})

app.post('/logout', async (req, res) => {
    const data = req.body
    const response_obj = request_handler.logout(data)
    response_obj.send_response(res)
})


app.post('/admin_panel/show_employee_list', (req, res) => {
    const response_obj = request_handler.show_employee_list(req.body)
    response_obj.send_response(res)
});

app.post('/admin_panel/show_employee_list/view_employee', (req, res) => {
    const response_obj = request_handler.view_employee(req.body)
    response_obj.send_response(res)
})

app.post('/admin_panel/show_employee_list/edit_employee', (req, res) => {
    const response_obj = request_handler.edit_employee(req.body)
    response_obj.send_response(res)
})

app.post('/admin_panel/show_employee_list/disable_employee', (req, res) => {
    const response_obj = request_handler.disable_employee(req.body)
    response_obj.send_response(res)
})


app.post('/admin_panel/show_employee_list/enable_employee', (req, res) => {
    const response_obj = request_handler.enable_employee(req.body)
    response_obj.send_response(res)

})

//can only be used for editing full name and working hours
app.post('/edit_profile', (req, res) => {
    const response_obj = request_handler.edit_oneself(req.body)
    response_obj.send_response(res)
})

app.post('/search', (req, res) => {
    const response_obj = request_handler.search_employees(req.body)
    response_obj.send_response(res)
})

app.post('/get_working_hour', (req, res) => {
    const response_obj = request_handler.get_working_hour(req.body)
    response_obj.send_response(res)
})

module.exports = app

