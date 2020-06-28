import { Subjects, TicketCreatedEvent, Publisher } from '@gittexing/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
