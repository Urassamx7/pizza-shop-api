import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { orders, products } from '.'
import { users } from './users'

export const restaurant = pgTable('restaurants', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  managerId: text('manager_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const restaurantsRelations = relations(restaurant, ({ one, many }) => {
  return {
    manager: one(users, {
      fields: [restaurant.managerId],
      references: [users.id],
      relationName: 'restaurant_manager',
    }),
    orders: many(orders),
    products: many(products),
  }
})
