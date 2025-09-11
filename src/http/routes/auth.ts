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
  .derive({ as: 'global' }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async (payload: JwtPayload) => {
        const token = await jwt.sign(payload)

        auth?.set({
          value: token,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        })
      },

      signOut: () => {
        auth?.remove()
      },

      getCurrentUser: async () => {
        const authCookie = auth?.value

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
