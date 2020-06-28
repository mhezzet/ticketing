import { Subjects, Publisher, TicketUpdatedEvent } from '@gittexing/common'

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
