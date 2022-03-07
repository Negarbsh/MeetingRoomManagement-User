const user_manager = require('../../data access/user manager')
const business_handler = require('../../business service/business_handler')
const User = require("../../models/user");

let emp1, emp2

beforeAll(async () => {
    emp1 = await user_manager.get_user_by_email('emp1')
    emp2 = await user_manager.get_user_by_email('emp2')
    if (!emp1)
        emp1 = await user_manager.create_employee(new User('emp1', 'emp1 password', 1234,
            'emp1 user', 'a department', 'an organization', 'emp1 and emp2 office', 9, 'employee'))
    if (!emp2)
        emp2 = await user_manager.create_employee(new User('emp2', 'emp2 password', 1234,
            'emp2 user', 'a department', 'an organization', 'emp1 and emp2 office', 10, 'employee'))
})

beforeEach(async () => {
    await business_handler.logout(emp1.email)
    await business_handler.logout(emp2.email)
})

test('login with valid mail and password', async () => {
    const response = await business_handler.login('emp1', 'emp1 password')
    emp1 = await user_manager.get_user_by_email('emp1')

    expect(response.status_code).toBe(200)
    expect(emp1.is_logged_in).toBe(true)

    await business_handler.logout(emp1.email)
})

test('login with invalid password', async () => {
    const response = await business_handler.login('emp1', 'a wrong password')
    emp1 = await user_manager.get_user_by_email('emp1')

    expect(response.status_code).toBe(406)
    expect(emp1.is_logged_in).toBe(false)
})


test('get working hour of another employee successfully', async () => {
    const response = await business_handler.get_working_hour('emp1', emp2.id)

    expect(response.status_code).toBe(200)
    expect(response.message.working_hours).toBe(emp2.working_hours)
})


test('edit full name without logging in', async () => {
    const response = await business_handler.edit_oneself('emp1', 'full_name', 'emp1 fullname!')

    expect(response.status_code).toBe(403)
})


test('edit full name successfully', async () => {
    await business_handler.login('emp1', 'emp1 password')
    const response = await business_handler.edit_oneself('emp1', 'full_name', 'emp1 fullname!')
    emp1 = await user_manager.get_user_by_email('emp1')

    expect(response.status_code).toBe(200)
    expect(emp1.full_name).toBe('emp1 fullname!')
})

test('edit full name with invalid mail, unsuccessful', async () => {
    await business_handler.login('emp1', 'emp1 password')
    const response = await business_handler.edit_oneself('invalid mail', 'full_name', 'emp1 fullname!')

    expect(response.status_code).toBe(403)
})

test('edit working hours successfully', async () => {
    await business_handler.login('emp1', 'emp1 password')
    const response = await business_handler.edit_oneself('emp1', 'working_hours', '200')

    expect(response.status_code).toBe(200)
    emp1 = await user_manager.get_user_by_email('emp1')
    expect(emp1.working_hours).toBe('200')
})

test('edit invalid field of profile', async () => {
    await business_handler.login('emp1', 'emp1 password')
    const response = await business_handler.edit_oneself('emp1', 'email', 'something')

    expect(response.status_code).toBe(406)
    expect(emp1.email).toBe('emp1')
})


test('get all employees from a department', async () => {
    const emp3 = await user_manager.create_employee(new User('emp3', 'emp3 password', 1234,
        'emp1 user', 'another department', 'an organization', 'the office', 9, 'employee'))

    await business_handler.login('emp1', 'emp1 password')
    const response = await business_handler.search_employees('emp1', 'a department', null)
    const search_result = response.message

    expect(response.status_code).toBe(200)
    expect(search_result[emp1.id].email).toBe('emp1')
    expect(search_result[emp2.id].email).toBe('emp2')
    expect(search_result[emp3.id]).toBe(undefined)
})

test('get all employees from an office', async () => {
    const emp4 = await user_manager.create_employee(new User('emp4', 'emp4 password', 1234,
        'emp1 user', 'a department', 'an organization', 'another office', 9, 'employee'))

    const response = await business_handler.search_employees('emp1', null, 'emp1 and emp2 office')
    const search_result = response.message

    expect(response.status_code).toBe(200)
    expect(search_result[emp1.id].email).toBe('emp1')
    expect(search_result[emp2.id].email).toBe('emp2')
    expect(search_result[emp4.id]).toBe(undefined)
})
