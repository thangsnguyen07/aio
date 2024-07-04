import { IQuery } from '@nestjs/cqrs'

export class FindUserByIdQuery implements IQuery {
  readonly id: string

  constructor(props: FindUserByIdQuery) {
    this.id = props.id
  }
}
