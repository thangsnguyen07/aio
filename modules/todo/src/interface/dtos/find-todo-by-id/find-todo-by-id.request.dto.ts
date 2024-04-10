import { IsUUID } from 'class-validator'

export class FindTodoByIdRequestDTO {
  @IsUUID()
  readonly id: string
}
