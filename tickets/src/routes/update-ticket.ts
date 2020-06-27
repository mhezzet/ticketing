import {
  currentUser,
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@gittexing/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Ticket } from '../models'

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

    res.send(ticket)
  }
)

export { router as updateTicketRouter }
