const app = require('../presentation/app')
const User = require('../model/user')
const supertest = require("supertest");
const access_manager = require('../business handling/access_manager')


test('get working hour of another employee', async () => {
    const emp1 = new User('emp1', 'a strong password1', 1234,
        'emp1 user', 'a department', 'an organization', 'the office', 9, 'employee', true, false)
    const emp2 = new User('emp2', 'a strong password1', 1234,
        'emp2 user', 'a department', 'an organization', 'the office', 10, 'employee', true, false)
    const token = await access_manager.create_access_token('emp1')
    User.login_user(emp1, token)

    const response = await supertest(app).post('/get_working_hour').send({'token': token, 'employee_id': 1})

    expect(response.status).toBe(200)
    expect(response.body.message.working_hours).toBe(10)
})