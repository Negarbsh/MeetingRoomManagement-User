const express = require('express');
const request_handler = require("./controller/user management/request_handling")

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//the request should be a json that has all user's fields
app.post('/sign_up_admin', async (req, res) => {
    const data = req.body
    const response_obj = request_handler.sign_up_admin(data)
    res.status(response_obj.status_code).send(response_obj.get_json())
});

//the request should be a json that has all user's fields
app.post('/create_employee', async (req, res) => {
    const data = req.body
    const response_obj = request_handler.sign_up_employee(data)
    res.status(response_obj.status_code).send(response_obj.get_json())
});


app.post('/login', (req, res) => {
    const data = req.body
    const response_obj = request_handler.login(data)
    res.status(response_obj.status_code).send(response_obj.get_json())
})

app.post('/logout', async (req, res) => {
    const data = req.body
    const response_obj = request_handler.logout(data)
    res.status(response_obj.status_code).send(response_obj.get_json())
})


app.post('/admin_panel/show_employee_list', (req, res) => {

    const response_obj = request_handler.show_employee_list(req.body)
    if (response_obj.should_redirect) {
        res.send({message: "please login first"})
        res.redirect(307, response_obj.redirecting_link); //todo How can I make sure it is working?
    } else res.status(response_obj.status_code).send(response_obj.get_json())


});

app.post('/admin_panel/show_employee_list/view_employee', (req, res) => {

})

module.exports = app

