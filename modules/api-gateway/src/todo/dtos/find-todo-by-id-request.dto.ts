import { IsUUID } from 'class-validator'

export class FindTodoByIdRequestDto {
  @IsUUID()
  id: string
}
