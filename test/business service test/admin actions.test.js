// const user_manager = require('../../data_access/user_manager')
import user_manager_class from '../../data_access/user_manager'
jest.mock('../../data_access/user_manager')

const business_manager = require('../../business service/business_handler')
const User = require("../../models/user");

let admin

beforeAll(async () => {
    await user_manager_class.delete_user('admin email')
    admin = await user_manager_class.create_admin(new User('admin email', 'admin password1', 1234,
        'admin user', 'a department', 'an organization', 'admin office', 9, 'admin'))
    await business_manager.logout(admin)
})


afterEach(async () => {
    await business_manager.logout('admin email')
})


test('login admin with invalid password, unsuccessful', async () => {
    const response = await business_manager.login('admin email', 'invalid password')
    admin = await user_manager_class.get_user_by_email('admin email')

    expect(response.status_code).toBe(406)
    expect(admin).toBe(undefined)
})

test('login admin successfully', async () => {
    const response = await business_manager.login('admin email', 'admin password1')
    admin = await user_manager_class.get_user_by_email('admin email')

    expect(response.status_code).toBe(200)
    expect(admin.is_logged_in).toBe(true)
})