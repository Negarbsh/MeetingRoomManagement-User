const user_manager = require('../../data access/user manager')
const business_manager = require('../../business service/business_handler')


let admin

beforeAll(async () => {
    await user_manager.delete_user('admin email')
    admin = await user_manager.create_admin('admin email', 'admin password1', 1234,
        'admin user', 'a department', 'an organization', 'admin office', 9, 'admin')
    await business_manager.logout(admin)
})

afterEach(async () =>{
    await business_manager.logout('admin email')
})


test('login admin with invalid password, unsuccessful', async () => {
    const response = await business_manager.login('admin email', 'invalid password')
    admin = await user_manager.get_user_by_email('admin email')

    expect(response.status_code).toBe(406)
    expect(admin.is_logged_in).toBe(false)
})

test('login admin successfully', async () => {
    const response = await business_manager.login('admin email', 'admin password1')
    admin = await user_manager.get_user_by_email('admin email')

    expect(response.status_code).toBe(200)
    expect(admin.is_logged_in).toBe(true)
})