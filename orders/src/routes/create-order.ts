import {
  currentUser,
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@gittexing/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Order, Ticket } from '../models'
import { natsClient } from '../nats-client'
import mongoose from 'mongoose'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'

const router = express.Router()

const EXPIRATION_WINDOW_SECOUNDS = 15 * 60

const validationSchema = [
  body('ticketId')
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('ticketId is required'),
]

router.post(
  '/api/orders',
  currentUser,
  requireAuth,
  validateRequest(validationSchema),
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    const ticket = await Ticket.findById(ticketId)
    if (!ticket) throw new NotFoundError()

    const isReserved = await ticket.isReserved()
    if (isReserved) throw new BadRequestError('this ticket is already in use')

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOUNDS)

    const order = Order.build({
      expiresAt: expiration,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      ticket,
    })
    await order.save()

    new OrderCreatedPublisher(natsClient.client).publish({
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      userId: order.userId,
      status: OrderStatus.Created,
      id: order.id,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    })

    res.status(201).send(order)
  }
)

export { router as createOrderRouter }
