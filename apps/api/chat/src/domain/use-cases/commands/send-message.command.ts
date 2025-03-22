import { Command, CommandProps } from 'core'

export class SendMessageCommand extends Command {
  readonly roomId: string
  readonly senderId: string
  readonly content: string

  constructor(props: CommandProps<SendMessageCommand>) {
    super(props)

    this.roomId = props.roomId
    this.senderId = props.senderId
    this.content = props.content
  }
}
