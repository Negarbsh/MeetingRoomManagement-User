const user_manager = require('../data access/user manager')
const business_handler = require('../business services/business_handler')

test('signup admin with invalid password, unsuccessful', async () => {
    const response = await business_handler.sign_up_admin('admin email', 'weak password')

    expect(response.status_code).toBe(406)
})

beforeAll(async () => {
    await user_manager.delete_user('admin email')
})


test('signup admin for the first time, successful', async () => {
    const response = await business_handler.sign_up_admin('admin email', '1 strong password', '1234', 'a', 'aa', 'asd', 'asdf', 'asdfg')

    expect(response.status_code).toBe(200)
    expect(user_manager.get_user_by_email('admin email')).toBeDefined()
    expect(user_manager.get_admin_mail()).toBe('admin email')
})

test('signup admin for the second time, unsuccessful', async () => {
    await business_handler.sign_up_admin('admin email', '1 strong password')
    const response = await business_handler.sign_up_admin('second admin email', '1 strong password')

    expect(response.status_code).toBe(406)
    expect((await user_manager.get_user_by_email('second admin email'))).toBe(null)
    expect(user_manager.get_admin_mail()).toBe('admin email')
})