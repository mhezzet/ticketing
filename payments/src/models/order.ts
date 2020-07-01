import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@gittexing/common'

interface OrderAttrs {
  id: string
  version: number
  userId: string
  price: number
  status: OrderStatus
}

interface OrderDoc extends mongoose.Document {
  version: number
  userId: string
  price: number
  status: OrderStatus
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    version: Number,
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
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

orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs)

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
