import chalk from 'chalk'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { env } from '../utils/env'

const connection = postgres(env.DATABASE_URL, {
  max: 1,
})
export const db = drizzle(connection)
await migrate(db, { migrationsFolder: 'drizzle' })

console.log(chalk.green('Migrations applied successfully!'))

await connection.end()

process.exit()
