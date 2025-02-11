import { Message } from 'node-nats-streaming'
import {
  Subjects,
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
} from '@gittexing/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
  queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data

    const order = await Order.findById(orderId)
    if (!order) throw new Error('order is not found')

    order.set({ status: OrderStatus.Complete })
    await order.save()

    msg.ack()
  }
}
