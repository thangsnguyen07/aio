import { IQuery } from '@nestjs/cqrs'

import { PaginatedQueryBase } from 'core'

export class GetMessagesQuery extends PaginatedQueryBase implements IQuery {
  readonly roomId: string

  constructor(props: { roomId: string; limit?: number; offset?: number }) {
    super({
      limit: props.limit,
      page: props.offset ? Math.floor(props.offset / (props.limit || 20)) : 0,
    })

    this.roomId = props.roomId
  }
}
