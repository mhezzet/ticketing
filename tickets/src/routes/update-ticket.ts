import { currentUser, requireAuth, validateRequest } from '@gittexing/common'
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

router.post(
  '/api/tickets/:id',
  currentUser,
  requireAuth,
  validateRequest(validationSchema),
  async (req: Request, res: Response) => {
    const { title, price } = req.body
  }
)

export { router as updateTicketRouter }
