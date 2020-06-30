import {
  currentUser,
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
  BadRequestError,
} from '@gittexing/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { natsClient } from '../nats-client'
import { Order } from '../models/order'
import { stripe } from '../../stripe'
import { Payment } from '../models/payments'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'

const router = express.Router()

const validationSchema = [
  body('token').notEmpty().withMessage('token is required'),
  body('orderId').notEmpty().withMessage('orderId is required'),
]

router.post(
  '/api/payments',
  currentUser,
  requireAuth,
  validateRequest(validationSchema),
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)
    if (!order) throw new NotFoundError()
    if (req.currentUser?.id !== order.userId) throw new NotAuthorizedError()
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError('order is cancelled')

    const charge = await stripe.charges.create({
      source: token,
      currency: 'usd',
      amount: order.price * 100,
    })

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    })

    await payment.save()

    new PaymentCreatedPublisher(natsClient.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    })

    res.status(201).send({ success: true })
  }
)

export { router as chargePaymentRouter }
