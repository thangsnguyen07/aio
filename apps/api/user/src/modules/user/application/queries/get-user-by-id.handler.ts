import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { GetUserByIdQuery } from '@/modules/user/domain/use-cases/queries/get-user-by-id.query'
import { UserRepositoryPort } from '@/modules/user/domain/user.repository.port'
import { status } from '@grpc/grpc-js'
import { User as GetUserByIdResponse } from 'proto'

import { InjectionToken } from '../injection-token'

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery, GetUserByIdResponse>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}
  async execute(query: GetUserByIdQuery): Promise<GetUserByIdResponse> {
    const { id } = query

    const user = await this.repository.findOneById(id)

    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      })
    }

    return {
      id: user.id,
      username: '',
      email: user.getProps().email.value,
      isActive: user.getProps().isActive,
      isVerified: user.getProps().isVerified,
    }
  }
}
