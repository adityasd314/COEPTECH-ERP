const { drizzle } = require( "drizzle-orm/node-postgres");
// const schema = require('./../db/schema');
const { Pool } =require( "pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool );
console.log(db)
module.exports = db;
