import { Email } from './value-objects/email.vo'
import { Password } from './value-objects/password.vo'

export interface UserProps {
  // username: string
  email: Email
  password: Password
  isActive?: boolean
  isVerified?: boolean
}
