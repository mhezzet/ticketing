import { Message } from 'node-nats-streaming'
import { Subjects, Listener, OrderCreatedEvent } from '@gittexing/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    })

    console.log('order created', 'payment')

    await order.save()

    msg.ack()
  }
}
