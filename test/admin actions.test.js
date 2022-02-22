const app = require('../app')
const User = require('../model/user')
const supertest = require("supertest");
const access_manager = require('../controller/user management/access_manager')

let admin, admin_data, emp_data;

beforeAll(() => {
    admin = new User('admin@email.com', 'a strong password1', 1234,
        'admin user', 'a department', 'an organization', 'the office', 9, 'admin', true, true)
    admin_data = {
        "email": "admin@email.com",
        "password": "a strong password1",
        "phone_number": 1234,
        "full_name": "admin user",
        "department": "a department",
        "organization": "an organization",
        "office": "the office",
        "working_hours": 9
    }
    emp_data = {
        "email": "another email",
        "password": "a strong password2",
        "phone_number": 12345,
        "full_name": "just like this",
        "department": "a dep name",
        "organization": "somewhere",
        "office": "somewhere else",
        "working_hours": 9,
        "token": 'admin token'
    }
})

test('create employee with valid token', async () => {
    const token = await access_manager.create_access_token('admin@email.com')
    User.login_user(admin, token)

    const response = await supertest(app).post('/create_employee').send({
        "email": "someone3",
        "password": "something3 else",
        "phone_number": "12345",
        "full_name": "the first",
        "department": "dep 1",
        "organization": "somewhere",
        "office": "office 2",
        "working_hours": 9,
        "token": token
    });
    const data = response.body

    expect(data.message).toBe('Employee is created successfully!')
    expect(response.status).toBe(200)
    expect(User.get_user_by_email('another email')).toBeDefined()
})

test('create employee with invalid token', async () => {
    const token = await access_manager.create_access_token('admin@email.com')
    User.login_user(admin, token)

    const response = await supertest(app).post('/create_employee').send({
        "email": "someone3",
        "password": "something3 else",
        "phone_number": "12345",
        "full_name": "the first",
        "department": "dep 1",
        "organization": "somewhere",
        "office": "office 2",
        "working_hours": 9,
        "token": token + 'aaa'
    });
    const data = response.body

    expect(data.message).toBe('access denied')
    expect(response.status).toBe(403)
    expect(User.get_user_by_email('another email')).toBe(null)
})


test('view the list of employees', async () => {
    const token = await access_manager.create_access_token('admin@email.com')
    User.login_user(admin, token)
    new User('email1', '123', 123, 'negar', 'dep1', 'org1', 'office1', 9, true, false)
    new User('email2', '123', 123, 'negin', 'dep1', 'org1', 'office2', 9, true, false)

    const response = await supertest(app).post('/admin_panel/show_employee_list').send({
        "token": token
    })

    expect(response.status).toBe(200)
    // expect(response.body.message).toBe(
    //   [  {
    //         "department": "dep1",
    //         "full name": "negar",
    //         "id": 1,
    //         "office": "office1"
    //     },
    //     {
    //         "department": "dep1",
    //         "full name": "negin",
    //         "id": 2,
    //         "office": "office2"
    //     }
    // ])
})