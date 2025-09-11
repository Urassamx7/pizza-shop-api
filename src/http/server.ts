import { Elysia } from 'elysia'
import { approveOrder } from './routes/approve-order'
import { sendAuthLink } from './routes/auth-link'
import { authenticateFromLink } from './routes/authenticate-form-link'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { getOrderDetails } from './routes/get-order-details'
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
  .use(getOrderDetails)
  .use(approveOrder)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = error.status
        return error.toResponse()
      default: {
        console.log(error)

        return new Response(null, { status: 500 })
      }
    }
  })

app.listen(3333, () => {
  console.log('🔥 Http server running!')
})
