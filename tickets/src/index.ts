import mongoose from 'mongoose'
import { app } from './app'
import { natsClient } from './nats-client'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

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
    new OrderCancelledListener(natsClient.client).listen()
    new OrderCreatedListener(natsClient.client).listen()

    natsClient.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })

    process.on('SIGINT', () => natsClient.client.close())
    process.on('SIGTERM', () => natsClient.client.close())

    app.listen(3000, () => console.log('🧇listening on port 3000!'))
  })
  .catch((error) => console.error(error))
