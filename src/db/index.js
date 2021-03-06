const {Pool} = require('pg')
require('dotenv').config()
const devConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
}
const pool = new Pool(devConfig)
module.exports = pool
