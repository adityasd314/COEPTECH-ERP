const { migrate } = require("drizzle-orm/neon-http/migrator");
const postgres = require("postgres");
const { drizzle } =  require('drizzle-orm/postgres-js')
const dotenv = require('dotenv');
dotenv.config();
const connectionString = process.env.DATABASE_URL

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client);
console.log({client, db})
const main = async () => {
	try {
		await migrate(db, {
		migrationsFolder: process.env.MIGRATIONS_FOLDER || '',
		});

		console.log("Migration successful");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main();