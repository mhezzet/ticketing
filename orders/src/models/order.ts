import mongoose from 'mongoose'
import { OrderStatus } from '@gittexing/common'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
  userId: string
  status: string
  expiresAt: Date
  ticket: TicketDoc
  version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: mongoose.Schema.Types.Date,
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.findByEvent = (event: { id: string; version: number }) =>
  Order.findOne({ _id: event.id, version: event.version - 1 })

orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs)

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
