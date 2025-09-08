import { Elysia } from 'elysia'
import { sendAuthLink } from './routes/auth-link'
import { registerRestaurant } from './routes/register-restaurant'

const app = new Elysia().use(registerRestaurant).use(sendAuthLink)

app.listen(3333, () => {
  console.log('🔥 Http server running!')
})
