export class UserRegisterDomainEvent {
  static readonly eventName = 'user.register'

  readonly userId: string
  readonly refreshToken: string

  constructor(props: UserRegisterDomainEvent) {
    this.userId = props.userId
    this.refreshToken = props.refreshToken
  }
}
