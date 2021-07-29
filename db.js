const pgpOptions = {
  connect (client, dc, useCount) {
    const cp = client.connectionParameters
    console.log('Connected to database:', cp.database)
  },
  disconnect (client, dc) {
    const cp = client.connectionParameters
    console.log('Disconnecting from database:', cp.database)
  },
  error (err, e) {
    console.error(err)
  }

}
const pgp = require('pg-promise')(pgpOptions)
pgp.pg.defaults.ssl = true

const databaseURL = process.env.DATABASE_URL || 'postgres://postgres@localhost/minigramdb'

let db = null
try {
  db = pgp(databaseURL)
} catch (error) {
  console.error(error)
}

module.exports = db
