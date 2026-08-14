require('dotenv').config()

const mysql = require('mysql2')

const pool = mysql.createPool({
  host: process.env.MONV1_DB_HOST,
  user: process.env.MONV1_DB_USER,
  database: process.env.MONV1_DB_NAME,
  password: process.env.MONV1_DB_PASSWORD,
  dateStrings: true,
})

module.exports = pool.promise()