export class UserLoginDomainEvent {
  static readonly eventName = 'user.login'

  readonly userId: string
  readonly refreshToken: string

  constructor(props: UserLoginDomainEvent) {
    this.userId = props.userId
    this.refreshToken = props.refreshToken
  }
}
