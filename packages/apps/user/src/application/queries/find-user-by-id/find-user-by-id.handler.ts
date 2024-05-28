import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { FindUserByIdQuery } from './find-user-by-id.query'

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor() {}
  execute(query: FindUserByIdQuery): Promise<any> {
    return null
  }
}
