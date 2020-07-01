import { natsClient } from './nats-client'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

if (!process.env.NATS_URL) {
  throw new Error('NATS_URL must be defined')
}

if (!process.env.NATS_CLIENT_ID) {
  throw new Error('NATS_URL must be defined')
}

if (!process.env.NATS_CLUSER_ID) {
  throw new Error('NATS_CLUSER_ID must be defined')
}

console.log('starting....')

natsClient
  .connect(
    process.env.NATS_CLUSER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URL!
  )
  .then(() => {
    process.on('SIGINT', () => natsClient.client.close())
    process.on('SIGTERM', () => natsClient.client.close())

    natsClient.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })

    new OrderCreatedListener(natsClient.client).listen()
  })
