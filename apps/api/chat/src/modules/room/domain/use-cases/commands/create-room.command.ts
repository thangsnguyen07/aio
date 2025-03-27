import { Command, CommandProps } from 'core'

export class CreateRoomCommand extends Command {
  readonly name: string
  readonly participantIds: string[]

  constructor(props: CommandProps<CreateRoomCommand>) {
    super(props)

    this.name = props.name
    this.participantIds = props.participantIds
  }
}
