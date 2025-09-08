import { Elysia } from 'elysia'
import { db } from '../../db/connection'
import { auth } from './auth'

export const getManagedRestsaurant = new Elysia()
  .use(auth)
  .get('/managed-restaurant', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new Error('User does not manage any restaurant.')
    }

    const managedRestaurant = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    if (!managedRestaurant) {
      throw new Error('User not found')
    }

    return managedRestaurant
  })
