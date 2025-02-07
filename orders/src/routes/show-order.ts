import {
  NotFoundError,
  currentUser,
  requireAuth,
  NotAuthorizedError,
} from '@gittexing/common'
import express, { Request, Response } from 'express'
import { Order } from '../models'

const router = express.Router()

router.get(
  '/api/orders/:orderId',
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) throw new NotFoundError()

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    res.send(order)
  }
)

export { router as showOrderRouter }
