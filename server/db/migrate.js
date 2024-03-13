const { drizzle } = require("drizzle-orm/neon-http");
const { migrate } = require("drizzle-orm/neon-http/migrator");
const { neon } = require("@neondatabase/serverless");

const sql = neon("postgresql://coeptechhackathon:smyK4rq2gewa@ep-dry-poetry-a52onwth-pooler.us-east-2.aws.neon.tech/coep_erp?sslmode=require");

const db = drizzle(sql);

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: "db/migrations" || '',
		});

		console.log("Migration successful");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main();