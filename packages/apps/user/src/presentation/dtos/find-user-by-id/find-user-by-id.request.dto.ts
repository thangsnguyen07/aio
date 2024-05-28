import { IsUUID } from "class-validator";

export class FindUserByIdRequestDto {
  @IsUUID()
  readonly id: string
}
