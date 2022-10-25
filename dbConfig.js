require('dotenv').config()

const { Pool } = require('pg')

// const isProduction = process.env.NODE_ENV === "production";

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
// postgresql://postgres:foodshadesukt@database-1.clqyrjllqloi.ap-south-1.rds.amazonaws.com:5432
// test
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

module.exports = { pool }
