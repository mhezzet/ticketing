import mongoose from 'mongoose'

interface PaymentAttrs {
  orderId: string
  stripeId: string
}

interface PaymentDoc extends mongoose.Document {
  orderId: string
  stripeId: string
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema(
  {
    stripeId: {
      type: String,
      required: true,
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
      versionKey: false,
    },
  }
)

paymentSchema.statics.build = (attrs: PaymentAttrs) => new Payment(Payment)

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
)

export { Payment }
