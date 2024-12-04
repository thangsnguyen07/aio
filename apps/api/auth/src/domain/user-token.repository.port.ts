import { RepositoryPort } from 'core'

import { UserToken } from './user-token.model'

export interface UserTokenRepositoryPort extends RepositoryPort<UserToken> {
  findOneByUserId(userId: string): Promise<UserToken | null>
  findOneByRefreshToken(userId: string): Promise<UserToken | null>
}
