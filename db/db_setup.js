const knex = require('knex')
const knexfile = require('./knexfile')

const db_setup = knex(knexfile.development)
module.exports = db_setup