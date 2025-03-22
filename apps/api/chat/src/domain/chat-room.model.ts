import { AggregateID, AggregateRoot, ArgumentInvalidException } from 'core'
import { randomUUID } from 'crypto'

export interface ChatRoomProps {
  name: string
  participantIds: string[]
}

export class ChatRoom extends AggregateRoot<ChatRoomProps> {
  protected readonly _id: AggregateID

  static create(props: Omit<ChatRoomProps, 'id'>): ChatRoom {
    const id = randomUUID()
    return new ChatRoom({ id, props })
  }

  addParticipant(userId: string): void {
    if (!this.props.participantIds.includes(userId)) {
      this.props.participantIds.push(userId)
    }
  }

  removeParticipant(userId: string): void {
    this.props.participantIds = this.props.participantIds.filter((id) => id !== userId)
  }

  validate(): void {
    if (!this.props.name) {
      throw new ArgumentInvalidException('Room name is required')
    }

    if (!this.props.participantIds || this.props.participantIds.length === 0) {
      throw new ArgumentInvalidException('Room must have at least one participant')
    }
  }
}
