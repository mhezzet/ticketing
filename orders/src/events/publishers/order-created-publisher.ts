import { Subjects, Publisher, OrderCreatedEvent } from '@gittexing/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
