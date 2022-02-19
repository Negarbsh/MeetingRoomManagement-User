const app = require('../app')
const User = require('../model/user')
const supertest = require("supertest");
const request_handler = require('../controller/user management/request_handling')
const access_manager = require('../controller/user management/access_manager')

let admin, admin_data, emp_data;

beforeAll(() => {
    admin = new User('admin@email.com', 'a strong password1', 1234,
        'admin user', 'a department', 'an organization', 'the office', 9, true)
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

    const response = await supertest(app).post('/create_employee').send();
    const data = await response.body

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.message).toBe('Employee is created successfully!')
    expect(User.get_user_by_email('another email')).toBeDefined()
})