import { BaseEntity } from '@ddd/core'
import { Column, Entity, Generated } from 'typeorm'

@Entity({ name: 'users' })
export class TodoEntity extends BaseEntity {
  @Column({ name: 'id', primary: true })
  @Generated('uuid')
  id: string

  @Column({ name: 'email' })
  email: string

  @Column({ name: 'username' })
  username: string

  @Column({ name: 'password' })
  password: string
}
