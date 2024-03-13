const { drizzle } = require("drizzle-orm/neon-http");
const { migrate } = require("drizzle-orm/neon-http/migrator");
const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv")
dotenv.config()

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: process.env.MIGRATION_FOLDER || '',
		});

		console.log("Migration successful");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main();