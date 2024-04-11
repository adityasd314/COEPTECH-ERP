const postgres = require("postgres")
const sql = postgres("postgres://postgres.rvvoznnspleurqmmeczr:4OwlYObWEsQeDoCZ@aws-0-us-west-1.pooler.supabase.com:5432/postgres")
const {users} = require('./db/schema')
const { drizzle } =  require('drizzle-orm/postgres-js')

async function main() {
    const db = drizzle(sql);
    const result = await db.select().from(users);
    console.log(result)
}

main()