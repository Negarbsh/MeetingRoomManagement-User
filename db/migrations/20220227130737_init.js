/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("app_users", (table) => {
        table.increments('id')
        table.string('email').notNullable()
        table.string('full_name').notNullable()
        table.string('hashed_password').notNullable()
        table.string('phone_number').notNullable()
        table.string('department').notNullable()
        table.string('organization_level').notNullable()
        table.string('office').notNullable()
        table.string('role')
        table.string('working_hours').notNullable()
        table.boolean('is_active').notNullable()
        table.boolean('is_admin').notNullable()
        table.boolean('is_logged_in').notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('app_users')
};
