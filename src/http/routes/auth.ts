import { jwt } from '@elysiajs/jwt'
import { Elysia, type Static, t } from 'elysia'
import { env } from '../../utils/env'
import { UnauthorizedError } from '../errors/unauthorized-error'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

type JwtPayload = Static<typeof jwtPayload>

export const auth = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case 'UNAUTHORIZED':
        set.status = 401
        return { code, message: error.message }
    }
  })
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
          throw new UnauthorizedError()
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        }
      },
    }
  })
