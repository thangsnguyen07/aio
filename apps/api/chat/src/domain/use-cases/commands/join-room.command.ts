import { Command, CommandProps } from 'core'

export class JoinRoomCommand extends Command {
  readonly roomId: string
  readonly userId: string

  constructor(props: CommandProps<JoinRoomCommand>) {
    super(props)

    this.roomId = props.roomId
    this.userId = props.userId
  }
}
