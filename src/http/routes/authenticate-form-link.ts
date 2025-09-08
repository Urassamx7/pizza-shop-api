import Elysia from 'elysia'
import { db } from '../../db/connection'
import { eq } from 'drizzle-orm'
import { authLinks, restaurant } from '../../db/schema'
import dayjs from 'dayjs'
import { auth } from './auth'

export const authenticateFromLink = new Elysia()
  .use(auth)
  .get('/auth-links/authenticate', async ({ query, jwt, set, setCookie }) => {
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

    const token = await jwt.sign({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    })

    setCookie('auth', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    await db.delete(authLinks).where(eq(authLinks.code, code as string))

    set.redirect = redirect
  })
