const user_manager = require('../data access/user manager')
const business_manager = require('../business services/business_handler')


let admin

beforeAll(() => {
    admin = user_manager.create_admin('admin email', 'admin password1', 1234,
        'admin user', 'a department', 'an organization', 'admin office', 9, 'admin')
})

test('login admin with invalid password, unsuccessful', async () => {
    const response = await business_manager.login('admin email', 'invalid password')

    expect(response.status_code).toBe(406)
    expect(admin.is_logged_in).toBe(false)
})

test('login admin successfully', async () => {
    const response = await business_manager.login('admin email', 'admin password1')

    expect(response.status_code).toBe(200)
    expect(admin.is_logged_in).toBe(true)
})