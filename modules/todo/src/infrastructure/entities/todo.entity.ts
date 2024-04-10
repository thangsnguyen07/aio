import { BaseEntity } from '@ddd/core'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'todos' })
export class TodoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'title' })
  title: string

  @Column({ name: 'description' })
  description: string
}
