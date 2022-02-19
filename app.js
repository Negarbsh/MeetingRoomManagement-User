const express = require('express');
const User = require("./model/user");
const request_handler = require("./controller/user management/request_handling")

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/create_employee', (req, res) => {
    const data = req.body
    //the request should be a json that has all user's fields (except is_admin)

    request_handler.sign_up_employee(data, res)
});

app.post('/sign_up_admin', (req, res) => {
    const data = req.body
    //the request should be a json that has all user's fields (except is_admin)
    request_handler.sign_up_admin(data, res)
});


app.post('/login', (req, res) => {
    const data = req.body
    request_handler.login(data, res).then(r => {})
})

app.post('/logout', (req, res) => {
    const data = req.body
    request_handler.logout(data, res)
})


app.post('/admin_panel', (req, res) => {
    if (User.online_users.includes(User.admin.id)) {
        //todo : show the admin panel!
    } else {
        res.redirect('/login');
    }
});

module.exports = app

