import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsClient } from '../nats-client'

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: { host: process.env.REDIS_HOST },
})

expirationQueue.process(async (jop) => {
  new ExpirationCompletePublisher(natsClient.client).publish({
    orderId: jop.data.orderId,
  })
})

export { expirationQueue }
