import { Command, CommandProps } from 'core'

export class UpdateUserPasswordCommand extends Command {
  readonly userId: string
  readonly currentPassword: string
  readonly newPassword: string

  constructor(props: CommandProps<UpdateUserPasswordCommand>) {
    super(props)

    this.userId = props.userId
    this.currentPassword = props.currentPassword
    this.newPassword = props.newPassword
  }
}
