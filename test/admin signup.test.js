const app = require('../app')
const User = require('../model/user')
const supertest = require("supertest");
const access_manager = require("../controller/user management/access_manager");

afterEach(() => {
    User.all_users = []
    User.online_users = []
    User.last_id = 0
    User.admin = null
    User.employee_list = []
})

test('sign up admin successfully', async () => {
    const response = await supertest(app).post('/sign_up_admin').send({
        "email": "admin mail",
        "password": "a strong password 123"
    })

    expect(response.status).toBe(200)
    expect(User.get_user_by_email('admin mail')).toBeTruthy()
})

test('sign up admin with short password, unsuccessful', async () => {
    const response = await supertest(app).post('/sign_up_admin').send({
        "email": "admin mail",
        "password": "weak1"
    })

    expect(response.status).toBe(406)
    expect(User.get_user_by_email('admin mail')).toBeNull()
})

test('sign up admin with password without digit, unsuccessful', async () => {
    const response = await supertest(app).post('/sign_up_admin').send({
        "email": "admin mail",
        "password": "a password without digits!"
    })

    expect(response.status).toBe(406)
    expect(User.get_user_by_email('admin mail')).toBeNull()
})
//
// test('sign up admin for the second time, unsuccessful', async () => {
//     const response = await supertest(app).post('/sign_up_admin').send({
//         "email": "another admin mail",
//         "password": "a strong password 123"
//     })
//
//     expect(response.status).toBe(406)
//     expect(User.get_user_by_email('admin mail')).toBeNull()
// })