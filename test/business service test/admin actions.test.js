// eslint-disable import/first


const user_manager = require('../../data_access/user_manager')
jest.mock('../../data_access/user_manager')
const business_manager = require('../../business service/business_handler')
const User = require("../../models/user");

let admin

beforeAll(async () => {
    await user_manager.delete_user('admin email')
    admin = await user_manager.create_admin(new User('admin email', 'admin password1', 1234,
        'admin user', 'a department', 'an organization', 'admin office', 9, 'admin'))
    await business_manager.logout(admin)
})


afterEach(async () => {
    await business_manager.logout('admin email')
})


beforeEach(async () => {

})

test("see if the mock works!", () => {
    const is_mocked = user_manager.is_mocked()
    expect(is_mocked).toBe(true)
})

test('login admin with invalid password, unsuccessful', async () => {
    const response = await business_manager.login('admin email', 'invalid password')

    expect(response.status_code).toBe(406)
})

test('login admin successfully', async () => {
    const response = await business_manager.login('admin email', 'admin password1')
    admin = await user_manager.get_user_by_email('admin email')

    expect(response.status_code).toBe(200)
    expect(admin.is_logged_in).toBe(true)
})