import { Elysia, t } from 'elysia'
import { sendAuthLink } from './routes/auth-link'
import { registerRestaurant } from './routes/register-restaurant'
import { jwt } from '@elysiajs/jwt'
import { env } from '../utils/env'
import cookie from '@elysiajs/cookie'

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(
    jwt({
      secret: env.JWT_SECRET,
      schema: t.Object({
        sub: t.String(),
        restaurantId: t.Optional(t.String()),
      }),
    }),
  )
  .use(cookie())

app.listen(3333, () => {
  console.log('🔥 Http server running!')
})
