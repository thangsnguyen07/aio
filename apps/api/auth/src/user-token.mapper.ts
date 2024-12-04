import { Injectable } from '@nestjs/common'

import { Mapper } from 'core'

import { UserToken } from './domain/user-token.model'

import { UserTokenResponseDto } from './application/dtos/user-token-response.dto'

import { UserTokenEntity } from './infrastructure/entities/user-token.entity'

@Injectable()
export class UserTokenMapper implements Mapper<UserToken, UserTokenEntity, UserTokenResponseDto> {
  toPersistence(model: UserToken): UserTokenEntity {
    const copy = model.getProps()
    const record: UserTokenEntity = {
      id: copy.id,
      userId: copy.userId,
      refreshToken: copy.refreshToken,
      revokedAt: copy.revokedAt,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
    }
    return record
  }

  toDomain(record: UserTokenEntity): UserToken {
    const model = new UserToken({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        userId: record.userId,
        refreshToken: record.refreshToken,
        revokedAt: record.revokedAt,
      },
    })
    return model
  }

  toResponse(model: UserToken): UserTokenResponseDto {
    const props = model.getProps()
    const response = new UserTokenResponseDto(model)
    response.accessToken = props.refreshToken
    return response
  }
}
