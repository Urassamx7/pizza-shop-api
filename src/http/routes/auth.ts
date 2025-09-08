import { cookie } from '@elysiajs/cookie'
import { jwt } from '@elysiajs/jwt'
import { Elysia, type Static, t } from 'elysia'
import { env } from '../../utils/env'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

type JwtPayload = Static<typeof jwtPayload>

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET,
      schema: jwtPayload,
    }),
  )
  .use(cookie())
  .derive({ as: 'global' }, ({ jwt, cookie, setCookie, removeCookie }) => {
    return {
      signUser: async (payload: JwtPayload) => {
        const token = await jwt.sign(payload)

        setCookie('auth', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        })
      },

      signOut: () => {
        removeCookie('auth')
      },

      getCurrentUser: async () => {
        const authCookie = cookie.auth

        const payload = await jwt.verify(authCookie)

        if (!payload) {
          throw new Error('Unauthorized.')
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        }
      },
    }
  })
