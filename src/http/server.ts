import { Elysia } from 'elysia'
import { sendAuthLink } from './routes/auth-link'
import { authenticateFromLink } from './routes/authenticate-form-link'
import { registerRestaurant } from './routes/register-restaurant'

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)

app.listen(3333, () => {
  console.log('🔥 Http server running!')
})
