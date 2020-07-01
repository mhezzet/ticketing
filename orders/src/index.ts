import mongoose from 'mongoose'
import { app } from './app'
import { natsClient } from './nats-client'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated.listener'
import { PaymentCreatedListener } from './events/listeners/payment-created-listener'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener'

if (!process.env.JWT_KEY) {
  throw new Error('JWT_KEY must be defined')
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be defined')
}

if (!process.env.NATS_URL) {
  throw new Error('NATS_URL must be defined')
}

if (!process.env.NATS_CLIENT_ID) {
  throw new Error('NATS_URL must be defined')
}

if (!process.env.NATS_CLUSER_ID) {
  throw new Error('NATS_CLUSER_ID must be defined')
}

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('🧇connected to db!')
    return natsClient.connect(
      process.env.NATS_CLUSER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    )
  })
  .then(() => {
    natsClient.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })

    new TicketCreatedListener(natsClient.client).listen()
    new TicketUpdatedListener(natsClient.client).listen()
    new PaymentCreatedListener(natsClient.client).listen()
    new ExpirationCompleteListener(natsClient.client).listen()

    process.on('SIGINT', () => natsClient.client.close())
    process.on('SIGTERM', () => natsClient.client.close())

    app.listen(3000, () => console.log('🧇listening on port 3000!'))
  })
  .catch((error) => console.error(error))
