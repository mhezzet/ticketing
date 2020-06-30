import { Publisher, Subjects, PaymentCreatedEvent } from '@gittexing/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
