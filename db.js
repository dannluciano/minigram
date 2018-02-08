const pgp = require('pg-promise')()

const db = pgp({
  host: 'postgres',
  user: 'postgres',
  password: 'postgres',
  database: 'minigramdb'
})

module.exports = db
