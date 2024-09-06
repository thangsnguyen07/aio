import { IsEmail, IsString } from 'class-validator'

export class CreateUserRequestDTO {
  @IsEmail()
  @IsString()
  username: string

  @IsString()
  password: string
}
