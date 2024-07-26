import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ValidateUserRequestDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @IsString()
  @IsNotEmpty()
  readonly password: string
}
