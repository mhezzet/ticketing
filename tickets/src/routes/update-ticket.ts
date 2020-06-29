import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@gittexing/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { TicketUpdatePublisher } from '../events/publishers/ticket-update-publisher'
import { Ticket } from '../models'
import { natsClient } from '../nats-client'

const router = express.Router()

const validationSchema = [
  body('title').isString().notEmpty().withMessage('title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('price must be greater than zero'),
]

router.put(
  '/api/tickets/:id',
  currentUser,
  requireAuth,
  validateRequest(validationSchema),
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) throw new NotFoundError()
    if (req.currentUser?.id !== ticket.userId) throw new NotAuthorizedError()

    ticket.set({
      title,
      price,
    })

    await ticket.save()

    await new TicketUpdatePublisher(natsClient.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    })

    res.send(ticket)
  }
)

export { router as updateTicketRouter }
