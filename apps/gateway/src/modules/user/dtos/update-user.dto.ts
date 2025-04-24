import { IsEmail, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  email: string
}
