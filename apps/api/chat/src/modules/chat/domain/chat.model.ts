import { AggregateID, AggregateRoot, ArgumentInvalidException } from 'core'

export interface ChatProps {
  roomId: string
  senderId: string
  content: string
}

export class Chat extends AggregateRoot<ChatProps> {
  protected readonly _id: AggregateID

  static create(props: Omit<ChatProps, 'id' | 'createdAt'>): Chat {
    const id = crypto.randomUUID()

    return new Chat({ id, props })
  }

  validate(): void {
    if (!this.props.roomId) {
      throw new ArgumentInvalidException('RoomId is required')
    }

    if (!this.props.senderId) {
      throw new ArgumentInvalidException('SenderId is required')
    }

    if (!this.props.content) {
      throw new ArgumentInvalidException('Content is required')
    }
  }
}
