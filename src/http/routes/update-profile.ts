import { eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { db } from '../../db/connection'
import { restaurant } from '../../db/schema'
import { auth } from './auth'

export const updateManagedRestaurant = new Elysia().use(auth).put(
  '/profile',
  async ({ getCurrentUser, body, set }) => {
    const { restaurantId } = await getCurrentUser()
    const { description, name } = body
    if (!restaurantId) {
      throw new Error('User does not manage any restaurant.')
    }

    const managedRestaurant = await db.query.restaurant.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    if (!managedRestaurant) {
      throw new Error('Restaurant not found')
    }

    await db
      .update(restaurant)
      .set({ description, name })
      .where(eq(restaurant.id, restaurantId))

    set.status = 204
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.String(),
    }),
  },
)
