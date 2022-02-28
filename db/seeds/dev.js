/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    // await knex('table_name').del()
    await knex('app_users').insert([
        {
            id: 1,
            email: 'email1',
            full_name: 'user one',
            hashed_password: 'password1',
            phone_number: '1234',
            department: 'dep1',
            office: 'office1',
            organization_level: 'a level',
            role: 'simple employee',
            working_hours: '24 hours :)',
            is_active: true,
            is_admin: false,
            is_logged_in: false,
        },
        {id: 2,
            email: 'email2',
            full_name: 'user two',
            hashed_password: 'password2',
            phone_number: '1234',
            department: 'dep1',
            office: 'office1',
            organization_level: 'a level',
            role: 'simple employee',
            working_hours: '24 hours :)',
            is_active: true,
            is_admin: false,
            is_logged_in: false,
        },
    ]);
};
