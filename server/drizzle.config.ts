import { defineConfig } from 'drizzle-kit'
export default defineConfig({
 schema: "./drizzle/schema.ts",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  out:"./db/new",
  verbose: true,
  strict: true,
})