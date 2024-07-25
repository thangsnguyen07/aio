import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { NotFoundException } from '@libs/core'
import { SuccessResponseDto } from '@libs/core/shared/presentation/dtos/response.dto'

import { status } from '@grpc/grpc-js'
import { UserRepositoryPort } from 'apps/user/src/domain/user.repository.port'

import { InjectionToken } from '../../injection-token'
import { FindUserByIdQuery } from './find-user-by-id.query'

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}
  async execute(query: FindUserByIdQuery): Promise<any> {
    const { id } = query

    const user = await this.repository.findOneById(id)

    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      })
    }

    return new SuccessResponseDto({
      id: user.id,
      email: user.getProps().email,
    })
  }
}
