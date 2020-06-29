import { Subjects, Publisher, OrderCancelledEvent } from '@gittexing/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
