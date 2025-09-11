import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { orderItems, restaurant, users } from '.'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'delivering',
  'delivered',
  'canceled',
])

export const orders = pgTable('orders', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text('customer_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  restaurantId: text('restaurant').references(() => restaurant.id, {
    onDelete: 'cascade',
  }),
  status: orderStatusEnum('Status').default('pending').notNull(),
  totalInCents: integer('total_in_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const ordersRelations = relations(orders, ({ one, many }) => {
  return {
    customer: one(users, {
      fields: [orders.customerId],
      references: [users.id],
      relationName: 'order_customer',
    }),
    restaurants: one(restaurant, {
      fields: [orders.restaurantId],
      references: [restaurant.id],
      relationName: 'order_restaurant',
    }),
    orderItems: many(orderItems),
  }
})
