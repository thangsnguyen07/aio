import { IsUUID } from 'class-validator'

export class FindUserByIdRequestDto {
  @IsUUID()
  id: string
}
