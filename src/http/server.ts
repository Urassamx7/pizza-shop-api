import { Elysia } from 'elysia'
import { sendAuthLink } from './routes/auth-link'
import { authenticateFromLink } from './routes/authenticate-form-link'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { getProfile } from './routes/get-profile'
import { registerRestaurant } from './routes/register-restaurant'
import { signOut } from './routes/sign-out'

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)

app.listen(3333, () => {
  console.log('🔥 Http server running!')
})
