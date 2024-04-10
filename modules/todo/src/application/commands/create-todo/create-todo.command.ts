import { Command, CommandProps } from '@ddd/core'

export class CreateTodoCommand extends Command {
  readonly userId: string
  readonly title: string
  readonly description: string

  constructor(props: CommandProps<CreateTodoCommand>) {
    super(props)

    this.userId = props.userId
    this.title = props.title
    this.description = props.description
  }
}
