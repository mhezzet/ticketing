import { Message } from 'node-nats-streaming'
import { Subjects, Listener, OrderCancelledEvent } from '@gittexing/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatePublisher } from '../publishers/ticket-update-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) throw new Error('Ticket not found')

    ticket.set({ orderId: undefined })
    await ticket.save()

    await new TicketUpdatePublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })

    msg.ack()
  }
}
