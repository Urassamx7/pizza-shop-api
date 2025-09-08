import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { db } from '../../db/connection'
import { authLinks, restaurant } from '../../db/schema'
import { auth } from './auth'

export const authenticateFromLink = new Elysia()
  .use(auth)
  .get('/auth-links/authenticate', async ({ query, set, signUser }) => {
    const { code, redirect } = query

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where: eq(authLinks.code, code as string),
    })

    if (!authLinkFromCode) {
      throw new Error('Invalid or expired authentication link')
    }

    const daysSinceAuthLinkWasCreate = dayjs().diff(
      authLinkFromCode.createdAt,
      'days',
    )

    if (daysSinceAuthLinkWasCreate > 7) {
      throw new Error(
        'Authentication link has expired. Please generate a new one.',
      )
    }

    const managedRestaurant = await db.query.restaurant.findFirst({
      where: eq(restaurant.managerId, authLinkFromCode.userId),
    })

    await signUser({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    })

    await db.delete(authLinks).where(eq(authLinks.code, code as string))

    set.redirect = redirect
  })
