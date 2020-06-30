import { Message } from 'node-nats-streaming'
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@gittexing/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete
  queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const { orderId } = data

    const order = await Order.findById(orderId).populate('ticket')
    if (!order) throw new Error('order is not found')

    if (order.status === OrderStatus.Complete) return msg.ack()

    order.set({ status: OrderStatus.Cancelled })
    await order.save()

    await new OrderCancelledPublisher(this.client).publish({
      id: orderId,
      version: order.version,
      ticket: order.ticket.id,
    })

    msg.ack()
  }
}
