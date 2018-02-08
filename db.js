const pgp = require('pg-promise')()

const databaseURL = process.env['DATABASE_URL'] || 'postgres://postgres:postgres@localhost/minigramdb'

const db = pgp(databaseURL)

module.exports = db
