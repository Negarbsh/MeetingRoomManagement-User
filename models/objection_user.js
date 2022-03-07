const { Model } = require('objection')

const db = require('../db/db_setup')

Model.knex(db)

class ObjectionUser extends Model {
    static get tableName() {
        return 'app_users'
    }

    static get idColumn() {
        return 'id';
    }

    static get joinSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'integer'},
                email: {type: 'string'},
                phone_number: {type: 'string'},
                full_name: {type: 'string'},
                department: {type: 'string'},
                organization_level: {type: 'string'},
                role: {type: 'string'},
                is_active: {type: 'boolean'},
                is_admin: {type: 'boolean'},
                hashed_password: {type: 'string'},
                office: {type: 'string'},
                working_hours: {type: 'string'},
            }
        }
    }
}

module.exports = ObjectionUser