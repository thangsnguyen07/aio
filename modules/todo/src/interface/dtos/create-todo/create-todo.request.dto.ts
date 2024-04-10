import { IsString, IsUUID } from 'class-validator'

export class CreateTodoRequestDTO {
  @IsUUID()
  userId: string

  @IsString()
  title: string

  @IsString()
  description: string
}
