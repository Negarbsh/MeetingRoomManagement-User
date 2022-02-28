const user_manager = require('../data access/user manager')
const business_handler = require('../business services/business_handler')

test('signup admin with invalid password, unsuccessful', async () => {
    const response = await business_handler.sign_up_admin('admin email', 'weak password')

    expect(response.status_code).toBe(406)
    expect(user_manager.get_user_by_email('admin email')).toBe(null)
    expect(user_manager.get_admin_mail()).toBe(null)
})


test('signup admin for the first time, successful', async () => {
    const response = await business_handler.sign_up_admin('admin email', '1 strong password')

    expect(response.status_code).toBe(200)
    expect(user_manager.get_user_by_email('admin email')).toBeDefined()
    expect(user_manager.get_admin_mail()).toBe('admin email')

    user_manager.delete_user('admin mail')
})

test('signup admin for the second time, unsuccessful', async ()=>{
    await business_handler.sign_up_admin('admin email', '1 strong password')
    const response = business_handler.sign_up_admin('second admin email', '1 strong password')

    expect(response.status_code).toBe(406)
    expect(user_manager.get_user_by_email('second admin email')).toBeUndefined()
    expect(user_manager.get_admin_mail()).toBe('admin email')
})