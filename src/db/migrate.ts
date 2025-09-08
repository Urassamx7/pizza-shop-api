import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';


const connection = postgres(process.env.DATABASE_URL!, {
    max: 1
});
export const db = drizzle(connection);
await migrate(db, { migrationsFolder: 'drizzle' });

await connection.end()

process.exit();

