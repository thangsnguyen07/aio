import { IsEmail, IsString } from 'class-validator'

export class CreateUserRequestDTO {
  @IsEmail()
  @IsString()
  email: string

  @IsString()
  password: string
}
