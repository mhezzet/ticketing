import {
  currentUser,
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@gittexing/common'
import express, { Request, Response } from 'express'
import { Order } from '../models'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsClient } from '../nats-client'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) throw new NotFoundError()

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    order.status = OrderStatus.Cancelled

    await order.save()

    new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    res.status(204).send(order)
  }
)

export { router as deleteOrderRouter }
