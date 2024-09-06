import { RepositoryPort } from '@libs/core'

import { User } from './user.model'

export interface UserRepositoryPort extends RepositoryPort<User> {
  findOneByEmail(email: string): Promise<User | null>
  findOneByUsername(username: string): Promise<User | null>
}
