import { faker } from '@faker-js/faker';
import { db } from './connection';
import chalk from 'chalk';
import { restaurant, users } from './schema';

/**
 * Reset database
 */

await db.delete(users)
await db.delete(restaurant)

console.log(chalk.yellow('✔️ Database reset.'))

/**
 * Create Customers
 */

await db.insert(users).values(
    [{
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        role: 'customer'
    },
    {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        role: 'customer'
    },]
)

console.log(chalk.yellow('✔️ Customers created.'))

/**
 * Create Manager
 */

const [manager] = await db.insert(users).values(
    [{
        name: faker.person.fullName(),
        email: "admin@admin.com",
        phone: faker.phone.number(),
        role: 'manager'
    }]
).returning({
    id: users.id
})

console.log(chalk.yellow('✔️ Manager created.'))
/**
 * Create Restaurants
 */
await db.insert(restaurant).values(
    [
        {
            name: faker.company.name(),
            description: faker.lorem,
            phone: faker.phone.number(),
            managerId: manager?.id
        }
    ]
)
console.log(chalk.yellow('✔️ Restaurants created.'))

console.log(chalk.blue('🎉 Seeding finished.'))
process.exit();

