const postgres = require("postgres")
const sql = postgres("postgres://postgres.rvvoznnspleurqmmeczr:4OwlYObWEsQeDoCZ@aws-0-us-west-1.pooler.supabase.com:5432/postgres")
const { drizzle } =  require('drizzle-orm/postgres-js')

const db = drizzle(sql);
module.exports = db;